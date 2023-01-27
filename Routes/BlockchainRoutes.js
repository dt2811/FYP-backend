const blockchainRouter = require('express').Router();
const ContractsController = require('../Controllers/ConnectContract');

// Create New Trasaction Block
blockchainRouter.post('/create-transaction', ContractsController.initTransactionBlock);

// Accept request
blockchainRouter.put('/accept-transaction', ContractsController.acceptRequest);

// Complete request
blockchainRouter.put('/complete-transaction', ContractsController.completeRequest);

// Delete Request
blockchainRouter.put('/delete-transaction', ContractsController.deleteRequest);

module.exports = blockchainRouter