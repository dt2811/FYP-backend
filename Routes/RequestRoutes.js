const requestRouter = require('express').Router();
const AuthMiddleWare = require('../Middlewares/Auth');
const NewRequestValidationMiddleware = require('../Middlewares/NewRequestValidation');
const RequestsController = require('../Controllers/Requests');

requestRouter.get('/get-requests', AuthMiddleWare, RequestsController.getMyRequests);
requestRouter.get('/get-pending-requests', AuthMiddleWare, RequestsController.getPendingRequests);
requestRouter.get('/get-approved-requests', AuthMiddleWare, RequestsController.getApprovedRequests);
requestRouter.get('/get-requests-posting', AuthMiddleWare, RequestsController.getAllRequestsPosting);
requestRouter.get('/get-requests-user', AuthMiddleWare, RequestsController.getAllRequestsUser);
requestRouter.post('/create-request', AuthMiddleWare, NewRequestValidationMiddleware, RequestsController.createNewRequest);
requestRouter.put('/accept-request', AuthMiddleWare, RequestsController.acceptRequest);
requestRouter.put('/reject-request', AuthMiddleWare, RequestsController.rejectRequest);
module.exports = requestRouter;