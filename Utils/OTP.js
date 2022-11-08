// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendOtp(phoneNumber, otp) {
    var body = "Hello,your OTP for the app is " + otp;
    var phone='+91'+phoneNumber.toString();
    try {
        var res = await client.messages
            .create({ body: body, from: process.env.TWILIO_NUMBER, to: phone })

        if (res.errorCode ===null) {
           return true;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
module.exports = sendOtp;