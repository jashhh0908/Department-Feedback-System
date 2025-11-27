import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    }, {_id: false}
);

const respondentInfoSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String },
    role: {
        type: String,
        enum: ['student', 'alumni', 'employer'],
    },
    batchYear: {
        type: Number,
        validate: {
            validator: function(year) {
                if(this.role === 'student' || this.role === 'alumni') {
                    return ( year != null && Number.isInteger(year) && year > 1900 && year < 2100)
                }
                return year == null;
            },
            message: "Batch year is only allowed for students/alumni and must be a valid year",
        }
    },
    companyName: {
        type: String,
        validate: {
            validator: function(name) {
                if(this.role === 'employer') {
                    return name != null && name.length > 0;
                }
                return name == null;
            },
            message: "Company Name is only allowed for employers",
        }
    },
}, {_id: false }
);

const feedbackResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeedbackForm',
        required: true,
    },
    respondentInfo: {
        type: respondentInfoSchema,
        default: undefined,
    },
    respondentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    isAnon: {
        type: Boolean,
        default: false
    },
    responses: {
        type: [ResponseSchema],
        validate: {
            validator: arr => Array.isArray(arr) && arr.length > 0,
            message: "Responses must be a non-empty array"
        }
    },
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true }
);

feedbackResponseSchema.pre("save", function (next) {
    if(this.isAnon) {
        this.respondentInfo = undefined;
        return next();
    }

    if(!this.respondentInfo)
        return next();

    const info = this.respondentInfo;

    if(info.role === 'student' || info.role === 'alumni') 
        info.companyName = undefined;

    if(info.role == 'employer')
        info.batchYear = undefined;
    if(!info.role){
        info.batchYear = undefined;
        info.companyName = undefined;
    }

    next();
})
const FeedbackResponse = mongoose.model('FeedbackResponse', feedbackResponseSchema);
export default FeedbackResponse;