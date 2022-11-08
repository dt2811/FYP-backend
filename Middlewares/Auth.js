var jwt = require('jsonwebtoken');
const Users = require('../Models/User');

async function AuthMiddleWare(req, res, next) {
    const token = req.headers.authorization;
    if (token) {

        try {
            var decodedToken = jwt.verify(token, process.env.JWT_KEY);
            console.log(decodedToken);
            var userInfo = await Users.findOne({PhoneNumber:decodedToken.PhoneNumber});
            if (userInfo) {
                req.body.user = userInfo;
                next();
                return;
            }
            else {
                console.log("HEY");
                res.status(401).send({ message: 'You are unauthorised user!!' });
            }
        }
        catch (err) {
            console.log(err);
            res.status(401).send({ message: 'You are unauthorised user!!' });
        }
    }
    else {
        res.status(401).send({ message: 'You are unauthorised user!!' })
    }
}


module.exports = AuthMiddleWare;