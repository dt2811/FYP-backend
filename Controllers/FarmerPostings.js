var jwt = require('jsonwebtoken');
const sendOtp = require('../Utils/OTP');
const bcrypt = require('bcrypt');
const Users = require('../Models/User');
require('dotenv').config();
class FarmerPostingsController {
    async createNewPost(req, res) {  // Create new post
        try {
            var FirstName = req.body.FirstName;
            var LastName = req.body.LastName;
            var IsFarmer = req.body.IsFarmer;
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


    requestOtp(req, res) {  // SEND OTP AFTER VERIFYINH
        let PhoneNumber = req.body.PhoneNumber;
        const regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        if (PhoneNumber) {
            if (regex.test(PhoneNumber) == true) {
                var otp = Math.floor(1000 + Math.random() * 9000).toString();
                var isOTPSent = true//sendOtp( PhoneNumber, otp);  // OTP FUNCTION
                if (isOTPSent) {
                    var hash = bcrypt.hashSync(otp, 10); // HASHING THE OTP 

                    let options = {
                        maxAge: 1000 * 60 * 5, // would expire after 5 minutes
                        httpOnly: true, // The cookie only accessible by the web server
                        // Indicates if the cookie should be signed
                    }
                    res.clearCookie(PhoneNumber.toString());
                    res.cookie(PhoneNumber.toString(), hash, options) // ADDING THE OTP IN COOKIE FOR T MINUTES
                    console.log(otp);
                    res.status(200).send({ message: 'OTP sent sucessfully !!' })
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
        res.status(400).send({ error: 'Could not read !!Please send valid PhoneNumber' });
    }

    async updatePostDetails(req, res) {
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
    async deletePost(req, res) { //delete users
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


}
module.exports = new UserController();