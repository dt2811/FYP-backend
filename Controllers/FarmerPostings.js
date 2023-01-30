const FarmerPosting = require('../Models/FarmerPostings');
const Users = require('../Models/User');
const Crops = require('../Models/Crop');

class FarmerPostingsController {
    async createNewPost(req, res) {  // Create new post
        try {
            var UserId = req.body.user.PhoneNumber;
            var CropId = req.body.CropId;
            var Details = req.body.Details;
            var Quantity = req.body.Quantity;
            var ImageUrls = req.body.ImageUrls;
            var Price = req.body.Price;
            var isValid = req.body.validation['isValid'];
            if (isValid === true) {
                var result = await Crops.findById(CropId); // CHECKING IF THE CROP IS THERE OR NOT
                if (result) {
                    const posting = new FarmerPosting({
                        UserId: UserId,
                        CropId: CropId,
                        Details: Details,
                        Quantity: Quantity,
                        ImageUrls: ImageUrls,
                        Price: Price,
                    });
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
                res.status(400).send(req.body.validation);
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
                var result = await FarmerPosting.findOneAndUpdate({ _id: id, UserID: PhoneNumber }, req.body.data); // CHECKING IF THE USER IS THERE OR NOT
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
            var result = await FarmerPosting.deleteOne({ _id: id, UserId: PhoneNumber });
            var tempArray = Array.from(req.body.user.Postings);
            tempArray.pop(result._id);
            result = Users.findOneAndUpdate({ PhoneNumber: PhoneNumber }, { Postings: tempArray });
            if (result) {
                res.status(200).send({ msg: 'post deleted' });
            }
            else {
                res.status(400).send({ error: "Error occured while saving at backend" });
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    async getAllPosts(req, res) {
        try {
            const result = await FarmerPosting.find();
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
                    delete tempUserDetails['Requests'];
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
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }
}
module.exports = new FarmerPostingsController();