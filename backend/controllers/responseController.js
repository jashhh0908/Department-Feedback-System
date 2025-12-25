import FeedbackResponse from "../models/feedbackResponse.model.js"
import FeedbackForm from "../models/feedbackForm.model.js"
import User from "../models/user.model.js";

const submitResponse = async (req, res) => {
    try {
        const formId = req.params.id;
        const userId = req.user.id;
        const respondentType = req.user.audienceType;
        const { responses, isAnon } = req.body;

        const user = await User.findById(userId);
        if(!user)
            return res.status(404).json({error: "User not found"});
        const form = await FeedbackForm.findById(formId);
        if(!form)
            return res.status(404).json({message: "Form not found"});
        if(!form.isActive)
            return res.status(400).json({message: "Form is not active"}); 
        const existing = await FeedbackResponse.findOne({
            formId,
            respondentId: userId
        });
        if(existing)
            return res.status(409).json({message: "You have already submitted the form"});
        if(form.targetAudience !== respondentType)
            return res.status(400).json({error: `Form intended only for ${form.targetAudience}`});

        let respondentInfo;
        if(!isAnon) {
            if((user.audienceType === 'student' || user.audienceType === 'alumni') && !user.batchYear) {
                return res.status(400).json({error: "Complete setting up your batch year in profile before submitting"});
            } 
            if((user.audienceType === 'employer' && !user.companyName)) {
                return res.status(400).json({error: "Complete setting up your company name in profile before submitting"});   
            }
            respondentInfo = {
                name: user.name,
                email: user.email,
                audienceType: user.audienceType,
            } 
            if(user.audienceType === 'student' || user.audienceType === 'alumni')
                respondentInfo.batchYear = user.batchYear;
            if(user.audienceType === 'employer')
                respondentInfo.companyName = user.companyName;
        }
        const questionIds = form.questions.map(q => q._id.toString());
        const submittedIds = responses.map(r => r.questionId.toString());
        for(const i of submittedIds) {
            if(!questionIds.includes(i))
                return res.status(400).json({message: `Invalid question submitted: ${i}`}); 
        }
        const response = await FeedbackResponse.create({
            formId,
            respondentId: userId,
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