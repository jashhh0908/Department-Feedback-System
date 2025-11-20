import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
});
const feedbackResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeedbackForm',
        required: true,
    },
    respondentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isAnon: {
        type: Boolean,
        default: false
    },
    responses: [ResponseSchema],
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true }
);

const FeedbackResponse = mongoose.model('FeedbackResponse', feedbackResponseSchema);
export default FeedbackResponse;