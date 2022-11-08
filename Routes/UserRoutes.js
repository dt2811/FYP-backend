const userrouter=require('express').Router();
const AuthMiddleWare=require('../Middlewares/Auth');
const ValidationMiddleware=require('../Middlewares/Validation');
const UpdateValidationMiddleware=require('../Middlewares/UpdateValidation');
const UserController=require('../Controllers/User');

userrouter.post('/otp',UserController.requestOtp);
userrouter.post('/login-signup',UserController.verifyOtp);
userrouter.post('/register',ValidationMiddleware,UserController.registerNewUser);
userrouter.post('/update-user',AuthMiddleWare,UpdateValidationMiddleware,UserController.updateUserDetails);
userrouter.get('/get-user',AuthMiddleWare,UserController.getUserDetails);
module.exports=userrouter;