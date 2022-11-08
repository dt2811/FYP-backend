const companyRouter=require('express').Router();
const AuthMiddleWare=require('../Middlewares/Auth');
const NewCompanyPostingValidation=require('../Middlewares/NewCompanyPostingValidation');
const UpdateCompanyPostingValidation=require('../Middlewares/UpdateCompanyPostingValidation');
const CompanyPostingsController=require('../Controllers/FarmerPostings');

companyRouter.get('/get-company-post',CompanyPostingsController.getAllPosts);
companyRouter.post('/create-company-post',AuthMiddleWare,NewCompanyPostingValidation,CompanyPostingsController.createNewPost);
companyRouter.put('/update-company-post',AuthMiddleWare,UpdateCompanyPostingValidation,CompanyPostingsController.updatePostDetails);
companyRouter.delete('/delete-company-post',AuthMiddleWare,CompanyPostingsController.deletePost);
module.exports=companyRouter;