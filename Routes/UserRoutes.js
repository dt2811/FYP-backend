const userrouter=require('express').Router();
const AuthMiddleWare=require('../Middlewares/Auth');
const ValidationMiddleware=require('../Middlewares/Validation');
const UserController=require('../Controllers/User');

userrouter.post('/otp',UserController.requestOtp);
userrouter.post('/login-signup',UserController.verifyOtp);
userrouter.post('/register',ValidationMiddleware,UserController.registerNewUser);
module.exports=userrouter;