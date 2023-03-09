var jwt = require('jsonwebtoken');
const sendOtp = require('../Utils/OTP');
const bcrypt = require('bcrypt');
const Users = require('../Models/User');
const OTPModel = require('../Models/OTP');
const FarmerPosting = require('../Models/FarmerPostings');
const CompanyPosting=require('../Models/CompanyPostings');
const Crops = require('../Models/Crop');
require('dotenv').config();
class UserController {

    generateToken(PhoneNumber) { // GENERATE JWT TOKEN
        return jwt.sign({ PhoneNumber }, process.env.JWT_KEY, {
            expiresIn: '7d',
        });
    }

    async verifyOtp(req, res) {  // OTP VERIFY CODE
        try {
            let PhoneNumber = req.body.PhoneNumber;
            let otp = req.body.OTP;
            const regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
            if (PhoneNumber && otp) {
                if (regex.test(PhoneNumber) == true) {

                    var OtpResponse = await OTPModel.findOne({ PhoneNumber: PhoneNumber })
                    if (OtpResponse) {
                        var isvalidOTP = bcrypt.compareSync(otp.toString(), OtpResponse['OTP'].toString()) // COMPARING THE HASHED OTP WITH THE OTP SENT BY UER
                        if (isvalidOTP) {

                            var deleteOtp = await OTPModel.deleteOne({ PhoneNumber: PhoneNumber });
                            if (deleteOtp) {

                                var result = await Users.findOne({ PhoneNumber: PhoneNumber }); // FINDING IF THE USER IS THERE IN THE DB OR NOT

                                if (result) {
                                    var token = new UserController().generateToken(PhoneNumber); // GENERATING AUTH TOKEN FOR FURTHER OTP VERIFICATION
                                    res.status(200).send({ message: 'OTP verified', data: result, token: token });
                                }
                                else {
                                    res.status(400).send({ error: 'User not regsitered' });
                                }
                            }
                            else {
                                res.status(400).send({ error: 'Error occured' });
                            }
                        }
                        else {
                            res.status(400).send({ error: 'Please send valid OTP' });
                        }
                        return;
                    }
                    else {
                        res.status(400).send({ error: 'Please Request OTP' });
                    }
                }
                else {
                    res.status(400).send({ error: 'Please send valid PhoneNumber' });
                    return;
                }

            }
            res.status(400).send({ error: 'Please send valid OTP and PhoneNumber' });
            return;
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    async registerNewUser(req, res) {  // REGISTER NEW USER
        try {
            var FirstName = req.body.FirstName;
            var LastName = req.body.LastName;
            var IsFarmer = req.body.IsFarmer === "True";
            var Address = req.body.Address;
            var State = req.body.State;
            var City = req.body.City;
            var Country = req.body.Country;
            var Coordinates = req.body.Coordinates;
            var email = req.body.Email;
            var CompanayName = req.body.CompanyName;
            var PhoneNumber = req.body.PhoneNumber;
            var isValid = req.body.validation['isValid'];
            if (isValid === true) {
                var result = await Users.findOne({ PhoneNumber: PhoneNumber }); // CHECKING IF THE USER IS THERE OR NOT
                if (result) {
                    res.status(400).send({ error: 'User already registered' });
                }
                else {
                    const user = new Users({
                        EthId: "abc",
                        FirstName: FirstName,
                        LastName: LastName,
                        IsFarmer: IsFarmer,
                        CompanyName: CompanayName,
                        Address: Address,
                        State: State,
                        City: City,
                        Country: Country,
                        Coordinates: Coordinates,
                        Email: email,
                        PhoneNumber: PhoneNumber,
                        PreviousOrders: [],
                        CurrentOrders: [],
                        Postings: [],
                    });
                    result = await user.save(); // ADDING USER AFTER VALIDATIONS
                    if (result) {
                        res.status(200).send({ message: 'User registered succesfully', data: result });
                        return;
                    }
                    else {
                        res.status(400).send({ error: 'User already registered' });
                    }
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


    async requestOtp(req, res) {  // SEND OTP AFTER VERIFYINH
        try {
        let PhoneNumber = req.body.PhoneNumber;
        console.log(req.body);
        const regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        if (PhoneNumber) {
            if (regex.test(PhoneNumber) == true) {
                var otp = Math.floor(1000 + Math.random() * 9000).toString();
                var isOTPSent = true
                // var isOTPSent = sendOtp(PhoneNumber, otp);  // OTP FUNCTION
                console.log(isOTPSent);
                if (isOTPSent) {
                    var hash = bcrypt.hashSync(otp, 10); // HASHING THE OTP 


                    //res.cookie(PhoneNumber.toString(), hash, options) // ADDING THE OTP IN COOKIE FOR T MINUTES
                    console.log(otp);
                 
                        var otp = new OTPModel({ PhoneNumber: PhoneNumber, OTP: hash });
                        var result = await otp.save();
                        if (result) {
                            res.status(200).send({ message: 'OTP sent sucessfully !!' })
                        }
                        else {

                            res.status(400).send({ error: 'Could not send OTP error occured!!' });

                        }
                        return;
                }
                else {
                    res.status(400).send({ error: 'Could not send OTP error occured!!' });
                    return;
                }


            }
            res.status(400).send({ error: 'Please send valid PhoneNumber' });
            return;
        }
        else{
        res.status(400).send({ error: 'Could not read !!Please send valid PhoneNumber' });
    }
        
    }
         
        catch (error) {
            // console.log(error);
            var deleteOtp = await OTPModel.deleteOne({ PhoneNumber: PhoneNumber });
            if (deleteOtp) {
                res.status(400).send({ error: 'Try Again !!' });
            }
            else {
                console.log(error);
                res.status(400).send({ error: 'Could not send OTP error occured!!' });
            }
        }
    }

    async updateUserDetails(req, res) {
        var PhoneNumber = req.body.user.PhoneNumber;
        try {
            if (req.body.isSaved === true) {
                var result = await Users.findOneAndUpdate({ PhoneNumber: PhoneNumber }, req.body.data); // CHECKING IF THE USER IS THERE OR NOT
                if (result) {
                    res.status(200).send({ Success: 'User saved', user: result });
                }
                else {
                    res.status(400).send({ error: "Error occured while saving at backend" });
                }
            }
            else {
                res.status(200).send({ Success: 'User saved', user: req.body.user });
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });

        }
    }
    async deleteUser(req, res) { //delete users
        var PhoneNumber = req.body.user.PhoneNumber;
        try {
            var result = await Users.deleteOne({ PhoneNumber: PhoneNumber });
            if (result) {
                res.status(200).send({ msg: 'User deleted' });
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

    getUserDetails(req, res) {
        try {
            res.status(200).send(req.body.user);
        }
        catch (error) {
            console.log(error);
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    async getMypost(req, res) {
        try {
            var isFarmer = req.body.user.IsFarmer;
            var PhoneNumber = req.body.user.PhoneNumber;
            if (isFarmer) {
                const result = await FarmerPosting.find({ UserId: PhoneNumber });
                let cropIds = []


                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) { 
                        const cropDetails = await Crops.find({ _id: result[i]['_doc'].CropId });
                        if (cropDetails) {
                            cropIds.push(cropDetails[0]);

                        }
                    }
                    console.log("yeh khali hai kya?",cropIds);
                    var tempData = [];
                    cropIds.forEach((crop, index) => { 
                        console.log("error",result[index]['_doc'])
                        var tempObj = Object.assign({}, result[index]['_doc']);
                        var tempUserDetails = req.body.user;
                        console.log("error hai ",crop);
                        var tempcrop = Object.assign({}, crop['_doc'])
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
                else {
                    res.status(200).send({ data: [] });
                }
            }

            else {
                const result = await CompanyPosting.find({ UserId: PhoneNumber });
                let cropIds = []

                console.log(result.length);
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) { // MANIPULATING THE STATIONS OBJECT
                        const cropDetails = await Crops.find({ _id: result[i].CropId });
                        if (cropDetails) {
                            cropIds.push(cropDetails[0]);

                        }
                    }
                    // console.log(cropIds);
                    var tempData = [];
                    cropIds.forEach((crop, index) => { // ADDING STATION DETAILS TO THE OBJECT
                        var tempObj = Object.assign({}, result[index]['_doc']);
                        var tempUserDetails = req.body.user;

                        var tempcrop = Object.assign({}, crop['_doc'])
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
                else {
                    res.status(200).send({ data: [] });
                }
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }
}


module.exports = new UserController();