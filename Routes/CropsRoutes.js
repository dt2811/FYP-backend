const cropsRouter=require('express').Router();
const AuthMiddleWare=require('../Middlewares/Auth');
const NewCropValidation=require('../Middlewares/NewCropValidation');
const UpdateCropValidation=require('../Middlewares/UpdateCropValidation');
const CropController=require('../Controllers/Crop');

cropsRouter.get('/get-crop',CropController.getCropDetails);
cropsRouter.post('/create-crop',AuthMiddleWare,NewCropValidation,CropController.registerNewCrop);
cropsRouter.put('/update-crop',AuthMiddleWare,UpdateCropValidation,CropController.updateCropDetails);
module.exports=cropsRouter;