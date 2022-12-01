const mongoose = require('mongoose');
const OtpSchema = new mongoose.Schema({
    OTP: {
        type: String,
        required: true,
    },
    PhoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    
}, { timestamps: true, _id: true });


const OTPModel = new mongoose.model('OTP', OtpSchema);

module.exports = OTPModel;