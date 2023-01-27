const mongoose = require('mongoose');
const RequestSchema = new mongoose.Schema({
    RequestInitiatorEthId: {
        type: String,
        required: true
    },
    RequestTargetEthId: {
        type: String,
        required: true
    },
    PostingId: {
        type: String,
        required: true
    },
    MessageFromRequestor: {
        type: String,
        required: false
    },
    IsComplete: {
        type: Boolean,
        required: true
    }
}, { timestamps: true, _id: true });

const Request = new mongoose.model('Request', RequestSchema);

module.exports = Request;