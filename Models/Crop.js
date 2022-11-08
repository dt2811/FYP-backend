const mongoose = require('mongoose');
const CropSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Images: {
        type: Array,
        required: true,
    },
}, { timestamps: true, _id: true });


const Crops = new mongoose.model('Crop',  CropSchema);

module.exports = Crops;