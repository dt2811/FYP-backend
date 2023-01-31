require('dotenv').config();
var ethers = require('ethers')
const { abi } = require('../Contracts/build/contracts/FYP.json');

// INSTRUCTION: DO NOT CONNECT WITH BACKEND BEFORE VALIDATING IF THIS WORKS!!!!

//TODO: 
//Error Handling All
//Checking if this works

class ContractController {

    constructor() {
        console.log("Initializing Contract...");

        // Print the Deployed Contract ABI
        // console.log("Contract ABI: ", abi);

        // Initialize the contract
        this.contract = this.init();

        // Bind Methods to the Class
        this.initTransactionBlock = this.initTransactionBlock.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
    }

    init() {
        // For Deployment Purposes on Infura Goerli Network
        const contractEndpoint = process.env.GORLI_ETH_ENDPOINT;
        const walletPrivateKey = process.env.ETHEREUM_ACCOUNT_PRIVATE_KEY;
        const contractAddress = process.env.DEPLOYED_CONTRACT_ADDRESS;


        // For Testing Purposes on Ganache Local Blockchain 
        // const walletPrivateKey = process.env.ETHEREUM_ACCOUNT_PRIVATE_KEY_GANACHE;
        // const contractAddress = process.env.DEPLOYED_CONTRACT_ADDRESS_GANACHE;

        // For Deployment Purposes on Infura Goerli Network
        const ethProvider = new ethers.providers.JsonRpcProvider(contractEndpoint);

        // For Testing Purposes on Ganache Local Blockchain
        // const ethProvider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");

        // Create new Wallet instance for signing transactions to the Blockchain
        const wallet = new ethers.Wallet(walletPrivateKey, ethProvider);

        // Create new read-only Ethers Contract
        const ethContract = new ethers.Contract(
            contractAddress,
            abi,
            ethProvider
        );

        // Connect the wallet to the Ethereum Contract
        const connectedEthContract = ethContract.connect(wallet);
        return connectedEthContract;
    }

    async initTransactionBlock(req, res) {
        try {

            // console.log("Contract Deployed at Address: ", this.contract.address)
            
            // Get the deployed contract
            const newcontract = this.contract;

            // Get the Data Object from the Middleware
            var RequestData = req.body.data;

            // Create Empty response object
            var TransactionResponse = {};

            // Call the initTransactionBlock function
            let transaction = await newcontract.initTransactionBlock(
                RequestData.createdAt,
                RequestData.FarmerId,
                RequestData.CompanyId,
                RequestData.RequestId
            );

            // Wait for the reply from Blockchain
            var transactionReply = await transaction.wait();

            // Check Point for Transaction Reply
            // console.log("Checkpoint #1: ", transactionReply);

            // Get the details of the TransactionLedger mapping from the Blockchain
            transactionReply = await newcontract.TransactionLedger(
                RequestData.RequestId
            );

            if (transactionReply) {
                TransactionResponse.TransactionId = ethers.utils.formatUnits(transactionReply[0], 0);
                TransactionResponse.RequestId = transactionReply[3];
                TransactionResponse.FarmerId = transactionReply[1];
                TransactionResponse.CompanyId = transactionReply[2];

                // Check Point for Transaction Reply
                // console.log("Checkpoint #2: ", transactionReply);

                res.status(200).send({ message: 'Transaction Added to Blockchain', data: TransactionResponse });
                return;
            }
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }



    async acceptRequest(req, res) {
        try {
            const newcontract = this.contract;
            var transactionId = req.body.transactionId;
            // var isFarmer = req.body.isFarmer;
            var isFarmer = false;

            let transaction = await newcontract.acceptRequest(
                transactionId,
                isFarmer
            )
            var transactionReply = await transaction.wait();
            if (transactionReply) {
                res.status(200).send({ message: 'Accept succesfully', data: transactionReply });
                return;
            }
            return;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }


    async completeRequest() {
        try {
            const newcontract = this.contract;
            var transactionId = req.body.transactionId;
            let transaction = await newcontract.completeRequest(
                transactionId
            )
            newcontract.on("TransactionBlockInitialized", (transactionId));
            var transactionReply = await transaction.wait();
            if (transactionReply) {
                res.status(200).send({ message: 'Accept succesfully', data: transactionReply });
                return;
            }
            return;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }

    async deleteRequest() {
        try {
            // Get Deployed Contract
            const newcontract = this.contract;

            // Get the Request Id
            var requestId = req.body.RequestId;

            // Call the Contract Function
            let transaction = await newcontract.deleteRequest(
                requestId,
            );

            // Wait for reply
            var transactionReply = await transaction.wait();
            if (transactionReply) {
                res.status(200).send({ message: 'Transaction Deleted', data: transactionReply });
                return;
            }
            return;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }
}

module.exports = new ContractController(); 