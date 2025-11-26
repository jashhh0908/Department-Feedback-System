import FeedbackResponse from "../models/feedbackResponse.model.js"
import FeedbackForm from "../models/feedbackForm.model.js"

const submitResponse = async (req, res) => {
    try {
        const formId = req.params.id;
        const { responses, isAnon, respondentInfo } = req.body;
        const form = await FeedbackForm.findById(formId);
        if(!form)
            return res.status(404).json({message: "Form not found"});
        if(!form.isActive)
            return res.status(400).json({message: "Form is not active"}); 
        if(!isAnon) {
            const existing = await FeedbackResponse.findOne({
                formId,
                "respondentInfo.email": respondentInfo?.email || null
                //respondentInfo is quoted as it is a nested field inside a db document. if we are accessing some field inside another field we use the '.' with quotes. 
                //'?' - optional chaining. basically if the user is anon, then the email will be undefined and would crash the code.
                // The null is put to ensure that if the email is undefined, we set it to null. 
            });
            if(existing)
                return res.status(409).json({message: "You have already submitted the form"});
        }       
        const questionIds = form.questions.map(q => q._id.toString());
        const submittedIds = responses.map(r => r.questionId.toString());
        for(const i of submittedIds) {
            if(!questionIds.includes(i))
                return res.status(400).json({message: `Invalid question submitted: ${i}`}); 
        }
        const response = await FeedbackResponse.create({
            formId,
            isAnon: isAnon ?? false, //Nullish Coalescing Operator - means that if isAnon is null/undefined then keep it false
            respondentInfo: isAnon ? undefined : respondentInfo,
            responses
        });
        
        res.status(201).json({
            message: "Response submitted successfully",
            data: response
        });
    } catch(error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export {
    submitResponse
}