const CompanyPosting = require('../Models/CompanyPostings');
const Users = require('../Models/User');
const Crops = require('../Models/Crop');
const Request = require('../Models/Requests');
const BlockchainController = require('../Controllers/ConnectContract');
class CompanyPostingsController {
    async createNewPost(req, res) {  // Create new post
        try {
            var UserId = req.body.user.PhoneNumber;
            var CropId = req.body.CropId;
            var Details = req.body.Details;
            var Quantity = req.body.Quantity;
            var Price = req.body.Price;
            var isValid = req.body.validation['isValid'];
            var IsFarmer = req.body.user.IsFarmer;
            if (isValid === true && IsFarmer === false) {
                var blockchainResult;
                var blockchainRequest = {};
                var result = await Crops.findById(CropId); // CHECKING IF THE CROP IS THERE OR NOT
                if (result) {
                    const posting = new CompanyPosting({
                        UserId: UserId,
                        CropId: CropId,
                        Details: Details,
                        Quantity: Quantity,
                        Price: Price,
                    });
                    


                    // Blockchain starts here

                    var tempObj = Object.assign({}, posting['_doc']);

                    blockchainRequest.IsFarmer = false;
                    blockchainRequest.PostingID = tempObj['_id'].toString();
                    blockchainRequest.UserId = UserId.toString();
                    blockchainRequest.CropId = CropId;
                    blockchainRequest.CropQuantity = Quantity;
                    blockchainRequest.CropDetails = Details;
                    blockchainRequest.CropPrice = Price;

                    // Log the Blockchain Request Body to the console
                    console.log("Blockchain Request: ", blockchainRequest);

                    // Call blockchain function here
                    blockchainResult = await BlockchainController.initPostBlock(blockchainRequest);

                    // Check response received from blockchain 
                    console.log("Blockchain Response: ", blockchainResult);

                    //ADD ERROR HANDLING FOR BLOCKCHAIN STUFF
                    if (blockchainResult.status == "Unsuccessful") {
                        throw new Error(blockchainResult.message);
                    } else {
                        // Log Successful Reply to console
                        console.log("Status: ", blockchainResult.status);
                        console.log("Message: ", blockchainResult.message);
                        console.log("Data: ", blockchainResult.data);
                    }

                    result = await posting.save(); // ADDING USER AFTER VALIDATIONS
                    var tempArray = Array.from(req.body.user.Postings);
                    var tempObj = Object.assign({}, result['_doc']);
                    tempArray.push(tempObj['_id']);

                    result = await Users.findOneAndUpdate({ PhoneNumber: UserId }, { Postings: tempArray });
                    if (result) {
                        tempObj = Object.assign({}, result['_doc']);
                        res.status(200).send({ message: 'Post succesfully', data: tempObj });
                        return;
                    }
                    else {
                        res.status(400).send({ error: 'ERROR occured while saving' });
                    }
                }
                else {
                    res.status(400).send({ error: 'Crop not found' });
                }
            }
            else {
                if (req.body.validation) {
                    res.status(400).send({ msg: "Not a company" });
                }
                else {
                    res.status(400).send(req.body.validation);
                }
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    async updatePostDetails(req, res) { //update posts
        var id = req.body.data.postId;
        var PhoneNumber = req.body.user.PhoneNumber;
        try {
            if (req.body.isSaved === true && typeof (id) !== 'undefined') {
                var result = await CompanyPosting.findOneAndUpdate({ _id: id, UserID: PhoneNumber }, req.body.data); // CHECKING IF THE USER IS THERE OR NOT
                if (result) {
                    res.status(200).send({ Success: 'Post saved', post: result });
                }
                else {
                    res.status(400).send({ error: "Error occured while saving at backend" });
                }
            }
            else {
                if (typeof (id) !== 'undefined') {
                    res.status(200).send({ Success: 'Post saved', post: req.body.data });
                }
                else {
                    res.status(400).send({ error: 'send post id' });
                }
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });

        }
    }
    async deletePost(req, res) { //delete post
        var id = req.body._id;
        var PhoneNumber = req.body.user.PhoneNumber;
        try {
            var result = await CompanyPosting.deleteOne({ _id: id });
            var tempArray = Array.from(req.body.user.Postings);
            tempArray.pop(result._id);

            result = await Users.findOneAndUpdate({ PhoneNumber: PhoneNumber }, { Postings: tempArray });
            var res2 = await Request.find({ PostingId: id });
            var requests = await Users.find();
            var res1 = true;
            let flag = false;
            for (let i = 0; i < requests.length; i++) {
                var tempArray = Array.from(requests[i].Requests);
                flag = false
                for (let j = 0; j < res2.length; j++) {
                    var _id = res2[j]._id
                    for (let k = 0; k < tempArray.length; k++) {
                        if (tempArray[k].equals(_id)) {
                            tempArray.pop(_id);
                            flag = true;
                            break;
                        }
                    }
                }
                if (flag == true) {
                    result = await Users.findOneAndUpdate({ PhoneNumber: requests[i].PhoneNumber }, { Requests: tempArray });
                }
            }
            var res1 = await Request.deleteMany({ PostingId: id });
            if (res1) {
                res.status(200).send({ msg: 'post deleted' });
            }
            else {
                res.status(400).send({ error: "Error occured while saving at backend" });
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }
    async getAllPosts(req, res) {
        try {
            const result = await CompanyPosting.find();
            let cropIds = []
            let userIds = []
            if (result.length > 0) {

                let cropIds = []
                let userIds = []
                console.log(result.length);
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) { // MANIPULATING THE STATIONS OBJECT
                        const userDetails = await Users.find({ PhoneNumber: result[i].UserId });
                        const cropDetails = await Crops.find({ _id: result[i].CropId });
                        if (userDetails && cropDetails) {
                            cropIds.push(cropDetails[0]);
                            userIds.push(userDetails[0]);
                        }
                    }
                    // console.log(cropIds);
                    var tempData = [];
                    userIds.forEach((user, index) => { // ADDING STATION DETAILS TO THE OBJECT
                        var tempObj = Object.assign({}, result[index]['_doc']);
                        var tempUserDetails = Object.assign({}, user['_doc']);

                        var tempcrop = Object.assign({}, cropIds[index]['_doc'])
                        delete tempUserDetails['_id'];
                        delete tempUserDetails['updatedAt'];
                        delete tempUserDetails['createdAt'];
                        delete tempUserDetails['EthId'];
                        delete tempUserDetails['CompanyName'];
                        delete tempUserDetails['PreviousOrders'];
                        delete tempUserDetails['CurrentOrders'];
                        delete tempUserDetails['Postings'];
                        delete tempcrop['_id'];
                        delete tempcrop['updatedAt'];
                        delete tempcrop['createdAt'];
                        delete tempObj['UserId'];
                        delete tempObj['CropId'];
                        delete tempObj['PhoneNumber'];
                        delete tempObj['updatedAt'];

                        tempObj['User'] = tempUserDetails;
                        tempObj['CropDetails'] = tempcrop;
                        tempData.push(tempObj);
                    });
                    //console.log("data is",tempData);
                    res.status(200).send({ data: tempData });
                }
            }
            else {
                res.status(400).send({ error: 'Error occured !!' });
                return;
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

}
module.exports = new CompanyPostingsController();