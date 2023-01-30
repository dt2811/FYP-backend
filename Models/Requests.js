const mongoose = require('mongoose');
const RequestStatus = Object.freeze({
    Pending: 'Pending',
    Accepted: 'Accepted',
    Rejected: 'Rejected'
})
const RequestSchema = new mongoose.Schema({
    RequestInitiatorId: {
        type: String,
        required: true
    },
    RequestTargetId: {
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
    RequestStatus: {
        type: String,
        required: true
    }
}, { timestamps: true, _id: true });

const Request = new mongoose.model('Request', RequestSchema);

module.exports = Request;