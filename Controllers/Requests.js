const Request = require('../Models/Requests');
const Users = require('../Models/User');
const FarmerPostings = require('../Models/FarmerPostings');
const CompanyPostings = require('../Models/CompanyPostings');
const BlockchainController = require('../Controllers/ConnectContract');
const Crops = require('../Models/Crop');
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
                var blockchainResult;
                var blockchainRequest = {};
                // If the user is a Farmer, then he can make requests only to Company Postings and vice versa
                if (isFarmer) {
                    // Get Company Posting Details from MongoDB
                    result = await CompanyPostings.findById(RequestData.PostingId);
                } else {
                    // Get Farmer Posting Details from MongoDB
                    result = await FarmerPostings.findById(RequestData.PostingId);
                }
                if (result) {
                    // Get the Phone Number of the User that has made the posting (i.e Target User)
                    var TargetUserId = result.UserId;

                    // console.log("JOJOJOJO");
                    // Create Request Object 
                    const request = new Request({
                        // RequestInitiatorId -> The Phone Number of the user who has made the request (i.e. Initiator)
                        RequestInitiatorId: RequestData.RequestInitiatorId,
                        // RequestTargetId -> The Phone Number of the User that has made the posting (i.e Target User)
                        RequestTargetId: TargetUserId,
                        // PostingId -> The Posting ID of the post made by the Target User
                        PostingId: RequestData.PostingId,
                        // MessageFromRequestor -> The message sent by the Initiator while making a Request
                        MessageFromRequestor: RequestData.Message,
                        // RequestStatus -> The Status of the request. Initialized with Pending, is Accepted when Target User accepts it, is Rejected when Target User rejects it
                        RequestStatus: RequestStatus.Pending
                    }); 

                    // Log the newly created request to the console
                    // console.log("New Request: ", request);

                    // Save the Request
                    result = await request.save();

                    // console.log("Get Result here", result);

                    // Generate the blockchain request object

                    // Get time in epoch
                    blockchainRequest.createdAt = Math.floor(new Date().getTime() / 1000);

                    // Assign the Farmer and Company IDs correctly
                    if (isFarmer) {
                        blockchainRequest.FarmerId = (RequestData.RequestInitiatorId.toString());
                        blockchainRequest.CompanyId = TargetUserId;
                    } else {
                        blockchainRequest.FarmerId = (TargetUserId.toString());
                        blockchainRequest.CompanyId = RequestData.RequestInitiatorId;
                    }

                    // Get the details of the newly made Request
                    var tempObj = Object.assign({}, request['_doc']);

                    // Convert the ObjectId object to a string for parsing by the blockchain
                    blockchainRequest.RequestId = tempObj['_id'].toString();

                    // Log the Blockchain Request Body to the console
                    console.log("Blockchain Request: ", blockchainRequest);

                    // Call blockchain function here
                    blockchainResult = await BlockchainController.initTransactionBlock(blockchainRequest);

                    // Check response received from blockchain 
                    // console.log("Blockchain Response: ", blockchainResult);

                    //ADD ERROR HANDLING FOR BLOCKCHAIN STUFF
                    if (blockchainResult.status == "Unsuccessful"){
                        throw new Error(blockchainResult.message);
                    } else {
                        // Log Successful Reply to console
                        console.log("Status: ", blockchainResult.status);
                        console.log("Message: ", blockchainResult.message);
                        console.log("Data: ", blockchainResult.data);
                    }

                    // Get all existing requests from the User
                    var tempArray = Array.from(req.body.user.Requests);

                    // Add the ID of the new Request to the array
                    tempArray.push(tempObj['_id']);

                    // Update the concerned user's Requests Array
                    result = await Users.findOneAndUpdate({ PhoneNumber: RequestData.RequestInitiatorId }, { Requests: tempArray });

                    // console.log("Get User here", result);
                    if (result) {
                        // Assign the result to an empty object 
                        tempObj = Object.assign({}, result['_doc']);

                        // HTTP 200 Response
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
        var blockchainRequest = {};
        var blockchainResult;
        var RequestId = req.body.RequestId;
        var PhoneNumber = req.body.user.PhoneNumber;
        try {
            var result = await Request.deleteOne({ _id: RequestId, UserId: PhoneNumber });

            //
            blockchainRequest.RequestId = RequestId;

            // Call blockchain function here
            blockchainResult = await BlockchainController.deleteRequest(blockchainRequest);

            // Check response received from blockchain 
            // console.log("Blockchain Response: ", blockchainResult);

            //ADD ERROR HANDLING FOR BLOCKCHAIN STUFF
            if (blockchainResult.status == "Unsuccessful"){
                throw new Error(blockchainResult.message);
            } else {
                // Log Successful Reply to console
                console.log("Status: ", blockchainResult.status);
                console.log("Mesage: ", blockchainResult.message);
                console.log("Data: ", blockchainResult.data);
            }

            var tempArray = Array.from(req.body.user.Requests);
            tempArray.pop(result._id);
            result = Users.findOneAndUpdate({ PhoneNumber: { PhoneNumber } }, { Requests: tempArray });
            if (result) {
                res.status(200).send({ message: 'Request deleted' });
            }
            else {
                res.status(400).send({ error: "Error occured while saving at backend" });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    async getRequestDetailsFromBlockchain(req, res) {
        var blockchainRequest = {};
        var blockchainResult;
        var RequestId = req.body.RequestId;
        try {
            // var result = await Request.deleteOne({ _id: RequestId, UserId: PhoneNumber });

            //
            blockchainRequest.RequestId = RequestId;

            // Call blockchain function here
            blockchainResult = await BlockchainController.getRequestDetails(blockchainRequest);

            // Check response received from blockchain 
            console.log("Blockchain Response: ", blockchainResult);

            //ADD ERROR HANDLING FOR BLOCKCHAIN STUFF
            if (blockchainResult.status == "Unsuccessful"){
                throw new Error(blockchainResult.message);
            } else {
                // Log Successful Reply to console
                console.log("Status: ", blockchainResult.status);
                console.log("Mesage: ", blockchainResult.message);
                console.log("Data: ", blockchainResult.data);
            }

            // var tempArray = Array.from(req.body.user.Requests);
            // tempArray.pop(result._id);
            // result = Users.findOneAndUpdate({ PhoneNumber: { PhoneNumber } }, { Requests: tempArray });
            if (true) {
                res.status(200).send({ message: 'Request deleted' });
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
            let requestorNames = [];
            let requestorCompany = [];
            // If there are any Requests with given filter
            if (result.length > 0) {
                // Loop to add all posts to postIds
                for (let i = 0; i < result.length; i++) {
                    let requestInitiatorDetails = await Users.find({ PhoneNumber: result[i].RequestInitiatorId });
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
                    if (requestInitiatorDetails) {
                        requestorNames.push(requestInitiatorDetails[0].FirstName + " " + requestInitiatorDetails[0].LastName);
                        requestorCompany.push(requestInitiatorDetails[0].isFarmer != undefined ? requestInitiatorDetails[0].CompanyName : "Farmer");
                    }
                    else {
                        requestorNames.push("Anonymous");
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
                    // delete tempUserDetails['CompanyName'];
                    delete tempUserDetails['PreviousOrders'];
                    delete tempUserDetails['CurrentOrders'];
                    delete tempUserDetails['Postings'];
                    delete tempObj['UserId'];
                    delete tempObj['CropId'];
                    delete tempObj['PhoneNumber'];
                    delete tempObj['updatedAt'];
                    tempObj['RequestInitiatorCompanyName'] = requestorCompany[index];
                    tempObj['RequestInitiatorName'] = requestorNames[index];
                    tempObj['User'] = tempUserDetails;
                    tempData.push(tempObj);
                });

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
    // Deprecated in favour of getAllRequestsUser
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
            let requestorNames = [];
            let requestorCompany = [];
            // If there are any Requests with given filter

            if (result.length > 0) {
                // Loop to add all posts to postIds
                for (let i = 0; i < result.length; i++) {
                    let requestInitiatorDetails = await Users.find({ PhoneNumber: result[i].RequestInitiatorId });

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
                    if (requestInitiatorDetails) {
                        requestorNames.push(requestInitiatorDetails[0].FirstName + " " + requestInitiatorDetails[0].LastName);
                        requestorCompany.push(requestInitiatorDetails[0].isFarmer != undefined ? requestInitiatorDetails[0].CompanyName : "Farmer");
                    }
                    else {
                        requestorNames.push("Anonymous");
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
                    // delete tempUserDetails['CompanyName'];
                    delete tempUserDetails['PreviousOrders'];
                    delete tempUserDetails['CurrentOrders'];
                    delete tempUserDetails['Postings'];
                    delete tempObj['UserId'];
                    delete tempObj['CropId'];
                    delete tempObj['PhoneNumber'];
                    delete tempObj['updatedAt'];
                    tempObj['RequestInitiatorCompanyName'] = requestorCompany[index];
                    tempObj['RequestInitiatorName'] = requestorNames[index];
                    tempObj['User'] = tempUserDetails;
                    tempData.push(tempObj);
                });

                res.status(200).send({ data: tempData });
            } else {
                res.status(200).send({ data: [] });
            }


        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }


    // Used by the Initiator to see which requests made by the initiator to the target have been accepted by the target
    // Deprecated in favour of getAllRequestsUser
    async getApprovedRequests(req, res) {
        try {
            var postDetails;
            var isFarmer = req.body.user.IsFarmer;
            var RequestTargetId = req.body.user.PhoneNumber;
            var PostingId = req.body.PostingId;

            // Get All Requests from MongoDB
            const result = await Request.find({PostingId: PostingId, RequestStatus: RequestStatus.Accepted });
            // To store Post IDs
            let postIds = [];
            let requestorDetails=[];
            // If there are any Requests with given filter

            if (result.length > 0) {
                // Loop to add all posts to postIds
                for (let i = 0; i < result.length; i++) {
                    let requestInitiatorDetails = await Users.find({ PhoneNumber: result[i].RequestInitiatorId });

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
                    if (requestInitiatorDetails) {
                        requestorDetails.push(requestInitiatorDetails[0]);
                    }
                    else {
                        requestorDetails({});
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
                    // delete tempUserDetails['CompanyName'];
                    delete tempUserDetails['PreviousOrders'];
                    delete tempUserDetails['CurrentOrders'];
                    delete tempUserDetails['Postings'];
                    delete tempObj['UserId'];
                    delete tempObj['CropId'];
                    delete tempObj['PhoneNumber'];
                    delete tempObj['updatedAt'];
                    tempObj['BuyerDetails']=requestorDetails[index];
                    tempObj['User'] = tempUserDetails;
                    tempData.push(tempObj);
                });
                res.status(200).send({ data: tempData });
            } else {
                res.status(200).send({ data: [] });
            }
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }


    // This function gets all requests made by current user on all posts
    async getAllRequestsUser(req, res) {
        try {
            var isFarmer = req.body.user.IsFarmer;
            // var PostingId = req.body.PostingId;
            var PhoneNumber = req.body.user.PhoneNumber;

            var postDetails;
            var cropDetails;

            // Get All Requests from MongoDB
            const result = await Request.find({ RequestInitiatorId: PhoneNumber });
            // To store Post IDs
            let postIds = [];
            let cropIds = [];
            let sellerDetails = [];
            // If there are any Requests with given filter
            if (result.length > 0) {
                // Declare Data Object
                var allRequestsDataObject = {};

                // Declare Arrays for storing pending and accepted requests for a post
                let pendingRequests = [];
                let acceptedRequests = [];

                // Loop to add all posts to postIds
                for (let i = 0; i < result.length; i++) {
                    // Get Length of Result Array
                    // console.log("Length: ", result.length);

                    // If user is a farmer then all the requests will be made to Company Postings and vice versa
                    if (isFarmer) {
                        postDetails = await CompanyPostings.find({ _id: result[i]["_doc"].PostingId });
                    } else {
                        // Get Farmer Posting Details from MongoDB
                        postDetails = await FarmerPostings.find({ _id: result[i]["_doc"].PostingId });
                    }
                    // Push Post ID into postIds
                    if (postDetails) {
                        // Get Details of Crop by using the Crop Id in the Posting Model
                        cropDetails = await Crops.find({ _id: postDetails[0].CropId });

                        let seller = await Users.find({ PhoneNumber: postDetails[0].UserId });

                        if (cropDetails) {
                            // Push Post IDs into the Array
                            postIds.push(postDetails[0]);

                            // Push Crop IDs into the Array
                            cropIds.push(cropDetails[0]);
                            sellerDetails.push(seller[0]);
                        } else {
                            res.status(400).send({ error: 'Crop Does Not Exist' });
                        }
                    }
                }
                postIds.forEach((post, index) => {

                    // Create Temporary Empty Object
                    var tempDataObj = {};

                    // Add Request Details to Object
                    // console.log("Request Details: ",  result[index]);
                    tempDataObj.RequestDetails = result[index];

                    // Add Post Details to Object
                    // console.log("Post Details: ", post);
                    tempDataObj.PostDetails = post;

                    // Add Seller Details to Object
                    // console.log("Seller Details: ", Seller[0]);
                    // tempDataObj.Target = Seller[0];

                    // Add Crop Details to Object
                    // console.log("Crop Details: ", cropIds[index]);
                    tempDataObj.CropDetails = cropIds[index];
                    tempDataObj.SellerDetails = sellerDetails[index];
                    // console.log("Temporary Data Object", tempDataObj);

                    // For Deleting Unnecessary Stuff

                    // delete tempDataObj.RequestDetails[<key>];
                    // delete tempDataObj.PostDetails[<key>];
                    // delete tempDataObj.SellerDetails[<key>];
                    // delete tempDataObj.CropDetails[<key>];


                    if (result[index].RequestStatus == "Pending") {
                        pendingRequests.push(tempDataObj);
                    } else {
                        acceptedRequests.push(tempDataObj);
                    }
                    // Clear the Temporary Data Object
                    tempDataObj = {};
                });
                allRequestsDataObject.ApprovedRequests = acceptedRequests;
                allRequestsDataObject.PendingRequests = pendingRequests;
                console.log("data is", allRequestsDataObject);
                res.status(200).send({ data: allRequestsDataObject });
            } else {
                res.status(200).send({ data: [] });
            }
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    // This function gets all requests made on a particular post.
    async getAllRequestsPosting(req, res) {
        try {
            var isFarmer = req.body.user.IsFarmer;
            var PhoneNumber = req.body.user.PhoneNumber;

            // Get Post ID from API Request
            var PostingId = req.body.PostingId;

            // Variables to store post and crop details
            var postDetails;
            var cropDetails;

            // Get All Requests from MongoDB such that the RequestTargetId is the Phone Number of the current user
            const result = await Request.find({ PostingId: PostingId, RequestTargetId: PhoneNumber });

            // If there are any requests made by the user
            if (result.length > 0) {
                // Get Length of Result Array
                // console.log("Length: ", result.length);

                // Declare Data Object
                var allRequestsDataObject = {};

                // Declare Arrays for storing pending and accepted requests for a post
                let pendingRequests = [];
                let acceptedRequests = [];

                // Get Post Details
                // If user is a farmer then all the posts retrieved will be Farmer Postings
                if (isFarmer) {
                    // Get Farmer Posting Details from MongoDB
                    postDetails = await FarmerPostings.find({ _id: PostingId });

                } else {
                    postDetails = await CompanyPostings.find({ _id: PostingId });
                }

                // Get Crop Details
                // In the response you should check that there is no Undefined tags as well as the Initiator ID should match the User's Phone Number
                if (postDetails) {
                    // Get Details of Crop by using the Crop Id in the Posting Model
                    cropDetails = await Crops.find({ _id: postDetails[0].CropId });
                }

                for (let i = 0; i < result.length; i++) {
                    var Seller = await Users.find({ PhoneNumber: result[i].RequestInitiatorId });
                    // Add error handling if user not found
                    if (Seller) {
                        // Create Temporary Empty Object
                        var tempDataObj = {};

                        // Add Request Details to Object
                        // console.log("Request Details: ", result[i]);
                        tempDataObj.RequestDetails = result[i];

                        // Add Post Details to Object
                        // console.log("Post Details: ", postDetails[0]);
                        tempDataObj.PostDetails = postDetails[0];

                        // Add Seller Details to Object
                        // console.log("Seller Details: ", Seller[0]);
                        tempDataObj.Requestor = Seller[0];

                        // Add Crop Details to Object
                        // console.log("Crop Details: ", cropDetails[0]);
                        tempDataObj.CropDetails = cropDetails[0];

                        // console.log("Temporary Data Object", tempDataObj);

                        // For Deleting Unnecessary Stuff

                        // delete tempDataObj.RequestDetails[<key>];
                        // delete tempDataObj.PostDetails[<key>];
                        // delete tempDataObj.SellerDetails[<key>];
                        // delete tempDataObj.CropDetails[<key>];

                        if (result[i].RequestStatus == "Pending") {
                            pendingRequests.push(tempDataObj);
                        } else {
                            acceptedRequests.push(tempDataObj);
                        }
                        // Clear the Temporary Data Object
                        tempDataObj = {};
                    } else {
                        res.status(400).send({ error: 'No Seller Found for Posting' });
                    }
                }
                allRequestsDataObject.PendingRequests = pendingRequests;
                allRequestsDataObject.ApprovedRequests = acceptedRequests;
                res.status(200).send({ data: allRequestsDataObject });
            } else {
                res.status(400).send({ error: 'No Requests Found with given PostingID' });
            }

        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }
}

module.exports = new RequestsController();