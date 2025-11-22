import FeedbackForm from "../models/feedbackForm.model.js";

const STAKEHOLDERS = ['student', 'alumni', 'employer'];
const QUESTION_TYPES = ['multiple-choice', 'rating', 'text'];
const validateQuestion = (questions) => {
    if(!Array.isArray(questions))
        return {
            message: "Questions are required",
            status: false
        }
    for(const question of questions) {
        if(!question.questionText || typeof question.questionText !== 'string')
            return {
                message: "Question text is required",
                status: false
            }
        if(!question.questionType || !QUESTION_TYPES.includes(question.questionType))
            return {
                message: "Question type is required and must be one of 'multiple-choice', 'rating', or 'text'",
                status: false
            }
        if(question.questionType === 'multiple-choice') {
            if(!Array.isArray(question.options) || question.options.length === 0) {
                return {
                    message: "MCQ must have options",
                    status: false
                }
            }
        } 
    }
    return {status: true};
};

const createForm = async(req, res) => {
    try {
        const {title, description, targetAudience, questions} = req.body;
        
        if(!req.user)
            return res.status(401).json({message: "Unauthenticated user"});
        const forbiddenFields = ["_id", "createdBy", "createdAt", "updatedAt", "isActive"];
        for(const field of forbiddenFields) {
            if(req.body[field] !== undefined) 
                return res.status(400).json({message: `Field ${field} cannot be modified`});
        }
        const creatorId = req.user.id;

        if(typeof title !== "string" || title.trim() === "") 
            return res.status(400).json({message: "Title must be a non-empty string"});
        
        const newTitle = title.trim();
        if(typeof description !== "string" || description.trim() === "")
            return res.status(400).json({message: "Description must be a non-empty string"});
        const newDescription = description.trim();
        if(!targetAudience || !STAKEHOLDERS.includes(targetAudience)) {
               return res.status(400).json({message: "Invalid target audience"});
        }
        if(!questions) {
            return res.status(400).json({message: "Questions are required"});
        }
        const validation = validateQuestion(questions);
        if(!validation.status)
            return res.status(400).json({message: validation.message});
        
        const newForm = await FeedbackForm.create({
            title: newTitle,
            description: newDescription,
            targetAudience,
            questions,
            createdBy: creatorId
        })
        if(!newForm)
            return res.status(400).json({message: "Form was not created"})
        
        return res.status(201).json({
            message: "Form created successfully", 
            form: newForm
        })
    } catch (error) {
        console.error("Error in createForm: ", error);
        if(error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: "Validation Error", errors});
        }
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const getForm = async(req, res) => {
    try {
        const forms = await FeedbackForm.find();
        return res.status(200).json({
            message: "Forms retrieved successfully",
            forms: forms})
    } catch (error) {
        console.error("Error in getForm: ", error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const getFormById = async(req, res) => {
    try {
        const formId = req.params.id;
        const form = await FeedbackForm.findById(formId);
        if(!form)
            return res.status(404).json({message: "Form not found"})
        
        return res.status(200).json({
            message: "Form retrieved successfully",
            form: form})
    } catch (error) {
        console.error("Error in getFormById: ", error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const updateForm = async(req, res) => {
    try {
        const formID = req.params.id;
        const forbiddenFields = ["_id", "createdBy", "createdAt", "updatedAt"];
        for(const field of forbiddenFields) {
            if(req.body[field] !== undefined) 
                return res.status(400).json({message: `Field ${field} cannot be modified`});
        }
        
        const {title, description, targetAudience, questions} = req.body;
        const form = await FeedbackForm.findById(formID);
        if(!form)
            return res.status(404).json({message: "Form not found"})
        if(targetAudience){
            if(!STAKEHOLDERS.includes(targetAudience)) {
               return res.status(400).json({message: "Invalid target audience"});
            }
            form.targetAudience = targetAudience;
        }
        if(questions) {
            const validation = validateQuestion(questions);
            if(!validation.status)
                return res.status(400).json({message: validation.message}); 
            form.questions = questions;
            form.markModified("questions"); // Indicates that the questions field has been modified and should be included in the update
        }
        
        if(typeof title === "string" && title.trim() !== "")
             form.title = title.trim();
        if(typeof description === "string" && description.trim() !== "") 
            form.description = description.trim();
        
        await form.save();
        return res.status(200).json({
            message: "Form updated successfully",
            form: form})
    } catch (error) {
        console.error("Error in updateForm: ", error);
        if(error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: "Validation Error", errors});
        }
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export { 
    createForm,
    getForm,
    getFormById, 
    updateForm
}