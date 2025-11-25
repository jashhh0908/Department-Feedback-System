import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: {
        type: String,
        enum: ['text', 'multiple-choice', 'rating'],
        required: true,
    },
    options: { 
        type: [String], 
        validate: {
            validator: function (arr) {
                if(this.questionType !== 'multiple-choice') return true;
                return Array.isArray(arr) && arr.length > 0;
            },
            message: "Multiple-choice questions must include at least one option"
        }
    }
});
const feedbackFormSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    targetAudience: {
        type: String,
        enum: ['student', 'alumni', 'employer'],
        required: true,
    },
    questions: [QuestionSchema],
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false},
    archivedAt: { type: Date, default: null},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }
);

const FeedbackForm = mongoose.model('FeedbackForm', feedbackFormSchema);
export default FeedbackForm;