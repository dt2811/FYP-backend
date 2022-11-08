const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    EthId: {
        type: String,
        required: true,
    },
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    IsFarmer: {
        type: Boolean,
        required: true,
    },
    CompanyName:{
        type: String,
    },
    Address: {
        type: String,
        required: true,
    },
    State: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    Country: {
        type: String,
        required: true,
    },
    Coordinates:{
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    PhoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    PreviousOrders: {
        type: Array,
    },
    CurrentOrders: {
        type: Array,
    },
    Postings: {
        type: Array,
    },
}, { timestamps: true, _id: true });


const User = new mongoose.model('Users', UserSchema);

module.exports = User;