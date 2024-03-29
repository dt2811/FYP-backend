const farmerRouter = require('express').Router();
const AuthMiddleWare = require('../Middlewares/Auth');
const NewFarmerPostingValidation = require('../Middlewares/NewFarmerPostingValidation');
const UpdateFarmerPostingValidation = require('../Middlewares/UpdateFarmerPostingValidation');
const FarmerPostingsController = require('../Controllers/FarmerPostings');

farmerRouter.get('/get-farmerpost', FarmerPostingsController.getAllPosts);
farmerRouter.post('/create-farmer-post', AuthMiddleWare, NewFarmerPostingValidation, FarmerPostingsController.createNewPost);
farmerRouter.put('/update-farmer-post', AuthMiddleWare, UpdateFarmerPostingValidation, FarmerPostingsController.updatePostDetails);
farmerRouter.delete('/delete-farmer-post', AuthMiddleWare, FarmerPostingsController.deletePost);
module.exports = farmerRouter;