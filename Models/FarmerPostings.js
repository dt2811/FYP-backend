const mongoose = require('mongoose');
const FarmerPostingSchema = new mongoose.Schema({
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
    ImageUrls: {
        type: Array,
        required: true,
    },
}, { timestamps: true, _id: true });


const FarmerPosting = new mongoose.model('FarmerPosting', FarmerPostingSchema);

module.exports = FarmerPosting;