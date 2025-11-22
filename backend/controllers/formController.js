import FeedbackForm from "../models/feedbackForm.model.js";

const createForm = async(req, res) => {
    try {
        const {title, description, targetAudience, questions} = req.body;
        if(!req.user)
            return res.status(401).json({message: "Unauthenticated user"})
        const creatorId = req.user.id;
        if(!title || !description || !targetAudience || !questions)
            return res.status(400).json({message: "All fields are required"})

        const newForm = await FeedbackForm.create({
            title,
            description,
            targetAudience,
            questions,
            createdBy: creatorId
        })
        if(!newForm)
            return res.status(400).json({message: "Form was not created"})
        
        return res.status(200).json({
            message: "Form created successfully", 
            form: newForm
        })
    } catch (error) {
        console.error("Error in createForm: ", error);
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

export { 
    createForm,
    getForm,
    getFormById
}