import FeedbackForm from "../models/feedbackForm.model.js";
import FeedbackResponse from "../models/feedbackResponse.model.js";

const ratingStats = (answers) => {
    const nums = answers.filter(a => a !== null).map(Number);
    if (nums.length === 0) return { count: 0, average: 0 };
    const sum = nums.reduce((a, b) => a + b, 0);
    return {
        count: nums.length,
        average: sum / nums.length
    };
}

const mcqStats = (question, answers) => {
    const counts = {};
    question.options.forEach(o => counts[o] = 0);

    answers.forEach(a => {
        if (a && counts[a] !== undefined) counts[a]++;
    });

    return counts;
}

const textStats = (answers) => {
    return answers.filter(a => typeof a === 'string' && a.trim() !== "");
}

const getAnalytics = async (req, res) => {
    try {
        const formId = req.params.id;
        const form = await FeedbackForm.findById(formId);
        if(!form)
            return res.status(400).json({error: "Form not found!"});
        const responses = await FeedbackResponse.find({formId});
        if(responses.length == 0)
            return res.status(400).json({error: "No responses found for this form!"});

        let analytics = [];
        for(const question of form.questions) {
            const type = question.questionType;
            const answers = responses.map(r => {
                const ans = r.responses.find(q => q.questionId.toString() == question._id.toString());
                if(ans) return ans.answer
                else return null;
            });

            let stats = [];
            if(type === 'rating') 
                stats = ratingStats(answers);
            else if(type === 'multiple-choice')
                stats = mcqStats(question, answers);
            else if(type === 'text')
                stats = textStats(answers);

            analytics.push({
                questionId: question._id,
                question: question.questionText,
                questionType: type,
                stats
            });
        }

        return res.status(200).json({
            message: `Analytics fetched succesfully for Form: ${form.title}`,
            analytics
        })
    } catch (error) {
        console.error("Error getting analytics:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export {
    getAnalytics
}