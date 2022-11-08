const cropsRouter=require('express').Router();
const AuthMiddleWare=require('../Middlewares/Auth');
const NewCropValidation=require('../Middlewares/NewCropValidation');
const UpdateCropValidation=require('../Middlewares/UpdateCropValidation');
const CropController=require('../Controllers/FarmerPostings');

cropsRouter.get('/get-crop',CropController.getAllPosts);
cropsRouter.post('/create-crop',AuthMiddleWare,NewCropValidation,CropController.createNewPost);
cropsRouter.put('/update-crop',AuthMiddleWare,UpdateCropValidation,CropController.updatePostDetails);
cropsRouter.delete('/delete-crop',AuthMiddleWare,CropController.deletePost);
module.exports=cropsRouter;