const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    semester: { type: String},
    department: { type: String,required:true },
    
    dp: {
        type: String,
        required: true,
        default: "https://i.pravatar.cc/300"
    },
    type: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student' // Default value is 'student'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
