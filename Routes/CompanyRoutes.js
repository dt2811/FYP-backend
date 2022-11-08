const companyRouter=require('express').Router();
const AuthMiddleWare=require('../Middlewares/Auth');
const NewCompanyPostingValidation=require('../Middlewares/NewCompanyPostingValidation');
const UpdateCompanyPostingValidation=require('../Middlewares/UpdateCompanyPostingValidation');
const CompanyPostingsController=require('../Controllers/FarmerPostings');

farmerRouter.get('/get-company-post',CompanyPostingsController.getAllPosts);
farmerRouter.post('/create-company-post',AuthMiddleWare,NewCompanyPostingValidation,CompanyPostingsController.createNewPost);
farmerRouter.put('/update-company-post',AuthMiddleWare,UpdateCompanyPostingValidation,CompanyPostingsController.updatePostDetails);
farmerRouter.delete('/delete-company-post',AuthMiddleWare,CompanyPostingsController.deletePost);
module.exports=companyRouter;