const blockchainRouter = require('express').Router();
const AuthMiddleWare=require('../Middlewares/Auth');
const ContractsController = require('../Controllers/ConnectContract');
const ContractTransactionInitializationValidationMiddleware = require("../Middlewares/ContractTransactionInitializationValidation");


// Create New Trasaction Block
blockchainRouter.post('/create-transaction', AuthMiddleWare, ContractTransactionInitializationValidationMiddleware, ContractsController.initTransactionBlock);

// Accept request
// blockchainRouter.put('/accept-transaction', ContractsController.acceptRequest);

// Complete request
// blockchainRouter.put('/complete-transaction', ContractsController.completeRequest);

// Delete Request
blockchainRouter.put('/delete-transaction', AuthMiddleWare, ContractsController.deleteRequest);

module.exports = blockchainRouter;