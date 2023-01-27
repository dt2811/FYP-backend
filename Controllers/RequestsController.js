const Request = require('../Models/Requests');
const Users = require('../Models/User');
const Crops = require('../Models/Crop');
const FarmerPostings = require('../Models/FarmerPostings');
const CompanyPostings = require('../Models/CompanyPostings');

class RequestsController {
    async createNewRequest(req, res) {
        try {
            var PostingId = req.body.PostingId;
            var UserId = req.body.user.PhoneNumber;
            var Message = req.body.Message;

            var result = await FarmerPostings.findById(PostingId);
            if (result) {
                const request = new Request({
                    RequestInitiatorId: UserId,
                    PostingId: PostingId,
                    Message: Message,
                    IsComplete: false
                });
                result = await request.save();
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    async updateRequest(req, res) {

    }

    async deleteRequest(req, res) {

    }

    async getAllRequests(req, res) {

    }
}

module.exports = RequestsController();