import FeedbackResponse from "../models/feedbackResponse.model.js"
import FeedbackForm from "../models/feedbackForm.model.js"

const submitResponse = async (req, res) => {
    try {
        const formId = req.params.id;
        const respondentId = req.user.id;
        const { responses, isAnon, respondentInfo } = req.body;
        const form = await FeedbackForm.findById(formId);
        if(!form)
            return res.status(404).json({message: "Form not found"});
        if(!form.isActive)
            return res.status(400).json({message: "Form is not active"}); 
        const existing = await FeedbackResponse.findOne({
            formId,
            respondentId
        });
        if(existing)
            return res.status(409).json({message: "You have already submitted the form"});
        const questionIds = form.questions.map(q => q._id.toString());
        const submittedIds = responses.map(r => r.questionId.toString());
        for(const i of submittedIds) {
            if(!questionIds.includes(i))
                return res.status(400).json({message: `Invalid question submitted: ${i}`}); 
        }
        const response = await FeedbackResponse.create({
            formId,
            respondentId,
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

//admin-only
const getResponses = async(req, res) => {
    try {
        const formId = req.params.id;
        const form = await FeedbackForm.findById(formId);
        if(!form)
            return res.status(404).json({message: "Form not found"});
        const responses = await FeedbackResponse.find({formId}).select("-respondentId");
        if(!responses)
            return res.status(400).json({message: "No responses found"});
        const totalResponses = responses.length;
        res.status(200).json({
            message: "Responses fetched successfully",
            totalResponses,
            responses,
        })
    } catch(error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export {
    submitResponse,
    getResponses
}