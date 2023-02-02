const Request = require('../Models/Requests');
const Users = require('../Models/User');
const FarmerPostings = require('../Models/FarmerPostings');
const CompanyPostings = require('../Models/CompanyPostings');
const RequestStatus = Object.freeze({
    Pending: 'Pending',
    Accepted: 'Accepted',
    Rejected: 'Rejected'
})

class RequestsController {
    async createNewRequest(req, res) {
        try {
            // Check if the User is a Farmer or Company
            var isFarmer = req.body.user.IsFarmer;

            // Get Validation of the request from Middleware
            var isValid = req.body.validation['isValid'];

            // Get data of the Request from the Middleware
            var RequestData = req.body.data;

            if (isValid) {
                var result;
                // If the user is a Farmer, then he can make requests only to Company Postings and vice versa
                if (isFarmer) {
                    // Get Company Posting Details from MongoDB
                    result = await CompanyPostings.findById(RequestData.PostingId);
                } else {
                    // Get Farmer Posting Details from MongoDB
                    result = await FarmerPostings.findById(RequestData.PostingId);
                }
                if (result) {
                    // Get the Phone Number of the Target User
                    var TargetUserId = result.UserId;

                    // Create Request Object 
                    const request = new Request({
                        RequestInitiatorId: RequestData.RequestInitiatorId,
                        RequestTargetId: TargetUserId,
                        PostingId: RequestData.PostingId,
                        MessageFromRequestor: RequestData.Message,
                        RequestStatus: RequestStatus.Pending
                    });

                    // Save the Request
                    result = await request.save();

                    // console.log("Get Result here", result);

                    // Get all existing requests from the User
                    var tempArray = Array.from(req.body.user.Requests);

                    // Get the details of the newly meade Request
                    var tempObj = Object.assign({}, result['_doc']);

                    // Add the ID of the new Request to the array
                    tempArray.push(tempObj['_id']);

                    // Update the concerned user's Requests Array
                    result = await Users.findOneAndUpdate({ RequestInitiatorId: RequestData.RequestInitiatorId }, { Requests: tempArray });

                    // console.log("Get User here", result);
                    if (result) {
                        tempObj = Object.assign({}, result['_doc']);
                        res.status(200).send({ message: 'Post Added Successfully!', data: tempObj });
                        return;
                    } else {
                        res.status(400).send({ error: 'ERROR occured while saving' });
                    }
                } else {
                    res.status(400).send({ error: 'No Result' });
                }
            } else {
                res.status(400).send(req.body.validation);
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    async acceptRequest(req, res) {
        var RequestId = req.body.RequestId;
        try {
            var result = await Request.findOneAndUpdate({ _id: RequestId }, { RequestStatus: RequestStatus.Accepted });
            if (result) {
                res.status(200).send({ Success: 'Request Accepted', Request: result });
            } else {
                res.status(400).send({ error: "Error occured while saving at backend" });
            }
        } catch (error) {

        }
    }

    async rejectRequest(req, res) {
        var RequestId = req.body.RequestId;
        try {
            var result = await Request.findOneAndUpdate({ _id: RequestId }, { RequestStatus: RequestStatus.Rejected });
            if (result) {
                res.status(200).send({ Success: 'Request Rejected', Request: result });
            } else {
                res.status(400).send({ error: "Error occured while saving at backend" });
            }
        } catch (error) {

        }
    }

    async deleteRequest(req, res) {
        var RequestId = req.body.id;
        var PhoneNumber = req.body.user.PhoneNumber;
        try {
            var result = await Request.deleteOne({ _id: RequestId, UserId: PhoneNumber });
            var tempArray = Array.from(req.body.user.Requests);
            tempArray.pop(result._id);
            result = Users.findOneAndUpdate({ PhoneNumber: { PhoneNumber } }, { Requests: tempArray });
            if (result) {
                res.status(200).send({ msg: 'Request deleted' });
            }
            else {
                res.status(400).send({ error: "Error occured while saving at backend" });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    // Gets all the pending requests made by the Initiator to the Target User's Posts
    async getMyRequests(req, res) {
        try {
            var isFarmer = req.body.user.IsFarmer;
            var RequestTargetId = req.body.user.PhoneNumber;
            var postDetails;
            // Get All Requests from MongoDB
            const result = await Request.find({ RequestTargetId: RequestTargetId, RequestStatus: RequestStatus.Pending });
            // To store Post IDs
            let postIds = [];

            // If there are any Requests with given filter
            if (result.length > 0) {
                // Loop to add all posts to postIds
                for (let i = 0; i < result.length; i++) {
                    // If user is a farmer then all the requests will be made to Company Postings and vice versa
                    if (isFarmer) {
                        postDetails = await CompanyPostings.find({ _id: result[i]["_doc"].PostingId });
                    } else {
                        // Get Farmer Posting Details from MongoDB
                        postDetails = await FarmerPostings.find({ _id: result[i]["_doc"].PostingId });
                    }
                    // Push Post ID into postIds
                    if (postDetails) {
                        postIds.push(postDetails[0]);
                    }
                }

                var tempData = [];
                postIds.forEach((post, index) => {
                    // Temporary container to hold Request Details
                    var tempObj = Object.assign({}, result[index]['_doc']);
                    // Temperory container to hold User Details
                    var tempUserDetails = req.body.user;
                    // Temporary container to hold Post Details
                    // var tempPost = Object.assign({}, post['_doc']);

                    // Delete unnecessary data
                    delete tempUserDetails['_id'];
                    delete tempUserDetails['updatedAt'];
                    delete tempUserDetails['createdAt'];
                    delete tempUserDetails['EthId'];
                    delete tempUserDetails['CompanyName'];
                    delete tempUserDetails['PreviousOrders'];
                    delete tempUserDetails['CurrentOrders'];
                    delete tempUserDetails['Postings'];
                    delete tempObj['UserId'];
                    delete tempObj['CropId'];
                    delete tempObj['PhoneNumber'];
                    delete tempObj['updatedAt'];

                    tempObj['User'] = tempUserDetails;
                    tempData.push(tempObj);
                });
                console.log("Data", tempData);
                res.status(200).send({ data: tempData });
            } else {
                res.status(200).send({ data: [] });
            }


        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    // Gets all the pending requests made on a post by multiple initiators
    async getPendingRequests(req, res) {
        try {
            var postDetails;
            var isFarmer = req.body.user.IsFarmer;
            var RequestTargetId = req.body.user.PhoneNumber;
            var PostingId = req.body.PostingId;

            // Get All Requests from MongoDB
            const result = await Request.find({ RequestTargetId: RequestTargetId, PostingId: PostingId, RequestStatus: RequestStatus.Pending });
            // To store Post IDs
            let postIds = [];
            // If there are any Requests with given filter
            if (result.length > 0) {
                // Loop to add all posts to postIds
                for (let i = 0; i < result.length; i++) {
                    // If user is a farmer then all the requests will be made to Company Postings and vice versa
                    if (isFarmer) {
                        postDetails = await CompanyPostings.find({ _id: result[i]["_doc"].PostingId });
                    } else {
                        // Get Farmer Posting Details from MongoDB
                        postDetails = await FarmerPostings.find({ _id: result[i]["_doc"].PostingId });
                    }
                    // Push Post ID into postIds
                    if (postDetails) {
                        postIds.push(postDetails[0]);
                    }
                }

                var tempData = [];
                postIds.forEach((post, index) => {
                    // Temporary container to hold Request Details
                    var tempObj = Object.assign({}, result[index]['_doc']);
                    // Temperory container to hold User Details
                    var tempUserDetails = req.body.user;
                    // Temporary container to hold Post Details
                    // var tempPost = Object.assign({}, post['_doc']);

                    // Delete unnecessary data
                    delete tempUserDetails['_id'];
                    delete tempUserDetails['updatedAt'];
                    delete tempUserDetails['createdAt'];
                    delete tempUserDetails['EthId'];
                    delete tempUserDetails['CompanyName'];
                    delete tempUserDetails['PreviousOrders'];
                    delete tempUserDetails['CurrentOrders'];
                    delete tempUserDetails['Postings'];
                    delete tempObj['UserId'];
                    delete tempObj['CropId'];
                    delete tempObj['PhoneNumber'];
                    delete tempObj['updatedAt'];

                    tempObj['User'] = tempUserDetails;
                    tempData.push(tempObj);
                });
                console.log("Data", tempData);
                res.status(200).send({ data: tempData });
            } else {
                res.status(200).send({ data: [] });
            }


        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }


    async getApprovedRequests(req, res) {
        try {
            var isFarmer = req.body.user.IsFarmer;

            // var PostingId = req.body.PostingId;
            var PhoneNumber = req.body.user.PhoneNumber;
            var postDetails;
            // Get All Requests from MongoDB
            const result = await Request.find({ PhoneNumber: PhoneNumber, RequestStatus: RequestStatus.Accepted });
            // To store Post IDs
            let postIds = [];
            // If there are any Requests with given filter
            if (result.length > 0) {
                // Loop to add all posts to postIds
                for (let i = 0; i < result.length; i++) {

                    // If user is a farmer then all the requests will be made to Company Postings and vice versa
                    if (isFarmer) {
                        postDetails = await CompanyPostings.find({ _id: result[i]["_doc"].PostingId });
                    } else {
                        // Get Farmer Posting Details from MongoDB
                        postDetails = await FarmerPostings.find({ _id: result[i]["_doc"].PostingId });
                    }
                    // Push Post ID into postIds
                    if (postDetails) {
                        postIds.push(postDetails[0]);
                    }
                }

                var tempData = [];
                postIds.forEach((post, index) => {
                    // Temporary container to hold Request Details
                    var tempObj = Object.assign({}, result[index]['_doc']);
                    // Temporary container to hold User Details
                    var tempUserDetails = req.body.user;
                    // Temporary container to hold Post Details
                    var tempPost = Object.assign({}, post['_doc']);

                    // Delete unnecessary data
                    delete tempUserDetails['_id'];
                    delete tempUserDetails['updatedAt'];
                    delete tempUserDetails['createdAt'];
                    delete tempUserDetails['EthId'];
                    delete tempUserDetails['CompanyName'];
                    delete tempUserDetails['PreviousOrders'];
                    delete tempUserDetails['CurrentOrders'];
                    delete tempUserDetails['Postings'];
                    delete tempObj['UserId'];
                    delete tempObj['CropId'];
                    delete tempObj['PhoneNumber'];
                    delete tempObj['updatedAt'];

                    tempObj['User'] = tempUserDetails;
                    tempData.push(tempObj);
                });
                console.log("Data", tempData);
                res.status(200).send({ data: tempData });
            } else {
                res.status(200).send({ data: [] });
            }


        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }
}

module.exports = new RequestsController();