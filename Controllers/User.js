var jwt = require('jsonwebtoken');
const sendOtp = require('../Utils/OTP');
const bcrypt = require('bcrypt');
const Users = require('../Models/User');
require('dotenv').config();
class UserController {
    constructor(){
        this.hashOtp="";}
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
            console.log(req.cookies[PhoneNumber.toString()]);
            if (PhoneNumber && otp) {
                if (regex.test(PhoneNumber) == true ) {
                    var isvalidOTP = bcrypt.compareSync(otp.toString(),UserController.hashOtp) // COMPARING THE HASHED OTP WITH THE OTP SENT BY UER
console.log(isvalidOTP);
                    if (isvalidOTP) {
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
                        res.status(400).send({ error: 'Please send valid OTP' });
                    }
                    return;
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
        console.log(req.body);
        const regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        if (PhoneNumber) {
            if (regex.test(PhoneNumber) == true) {
                var otp = Math.floor(1000 + Math.random() * 9000).toString();
                var isOTPSent = true//sendOtp( PhoneNumber, otp);  // OTP FUNCTION
                if (isOTPSent) {
                    var hash = bcrypt.hashSync(otp, 10); // HASHING THE OTP 

                    let options = {
                        samesite:'none',
                        maxAge: 1000 * 60 * 5, // would expire after 5 minutes
                        httpOnly: false, // The cookie only accessible by the web server
                        secure:false// Indicates if the cookie should be signed
                    }
                    res.clearCookie(PhoneNumber.toString());
                    UserController.hashOtp=hash;
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
}
module.exports = new UserController();