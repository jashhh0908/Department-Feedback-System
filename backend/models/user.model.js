import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: {
        type: String,
        enum: ['user', 'admin', 'super-admin'],
        default: 'user'
    },
    audienceType: {
        type: String,
        enum: ['student', 'alumni', 'employer'],
        validate: {
            validator: function(value) {
                if(this.role === 'user')
                    return value != null;
                return true;
            },
            message: 'audience type is required for users'
        }
    },
    batchYear: {
        type: Number,
        validate: {
            validator: function(year) {
                if(this.audienceType === 'student' || this.audienceType === 'alumni') {
                    return ( year != null && Number.isInteger(year) && year > 1900 && year < 2100)
                }
                return year == null; 
            },
            message: "Batch year is only allowed for students/alumni and must be a valid year"
        } 
    },
    companyName: {
        type: String, 
        validate: {
            validator: function(name) {
                if(this.audienceType === 'employer') {
                    return name != null && name.length > 0;
                }
                return name == null;
            },
            message: "Company Name is only allowed for employers"
        }
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    if(this.role === 'admin' || this.role === 'super-admin') {
        this.audienceType = undefined;
        this.companyName = undefined;
        this.batchYear = undefined;
        return next();
    }

    if(this.audienceType === 'student' || this.audienceType === 'alumni') 
        this.companyName = undefined;
        

    if(this.audienceType== 'employer')
        this.batchYear = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
