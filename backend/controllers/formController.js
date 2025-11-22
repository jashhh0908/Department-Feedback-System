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

export { 
    createForm
}