const mongoose = require('mongoose');
const CompanyPostingSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true,
    },
    CropId:{
        type:String,
        required:true,
    },
    Quantity:{
        type:String,
        required:true,
    },
    Details: {
        type: String,
        required: true,
    },
    Price:{
        type: String,
        required: true,
    },
}, { timestamps: true, _id: true });


const CompanyPosting = new mongoose.model('CompanyPosting', CompanyPostingSchema);

module.exports = CompanyPosting;