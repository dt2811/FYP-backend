require('dotenv').config();
var fs = require('fs');
var ethers = require('ethers')
const fsPromises = fs.promises;

// INSTRUCTION: DO NOT CONNECT WITH BACKEND BEFORE VALIDATING IF THIS WORKS!!!!

//TODO: 
//Error Handling All
//Checking if this works
// Add something to get all the postings from the blockchain; refer IPD codes

class ContractController {

    constructor() {
        console.log("HIIIIII");
        this.contract = this.init();
        this.initTransactionBlock = this.initTransactionBlock.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
        // console.log(this.contract.address)
        // console.log(this.contract.functions)
    }

    getAbi() {
        // IF CONTRACT IS UPDATED PLEASE UPDATE THIS ABI, IK IT'S SUPER STUPID BUT IDK WHAT ELSE TO DO
        const abi = [
            "function initTransactionBlock(uint256 dateRequestPosted, string memory farmerId, string memory companyId, string memory requestId) public returns (int256)",
            "function deleteRequest(string memory requestId) public",
            "event TransactionBlockInitialized(int256 transactionID)",
        ]
        return abi;
    }

    init() {
        const ethProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
        const ethSigner = ethProvider.getSigner();
        const abi = this.getAbi();
        const ethContract = new ethers.Contract(
            process.env.DEPLOYED_CONTRACT_ADDRESS,
            abi,
            ethSigner
        );
        return ethContract;
    }

    async initTransactionBlock(req, res) {
        try {
            console.log(this.contract.address)
            // Get the deployed contract
            const newcontract = this.contract;

            // Get the Data Object from the Middleware
            var RequestData = req.body.data;

            let transaction = await newcontract.initTransactionBlock(
                RequestData.createdAt,
                RequestData.FarmerId,
                RequestData.CompanyId,
                RequestData.RequestId
            );

            // Wait for the reply from Blockchain
            var transactionReply = await transaction.wait();

            console.log(transactionReply);

            transactionReply = {};

            // Listen for TransactionBlockInitialized event
            newcontract.on("TransactionBlockInitialized", (transactionID) => {
                transactionReply.transactionID = transactionID;
            });

            if (transactionReply) {
                res.status(200).send({ message: 'Transaction Added to Blockchain', data: transactionReply });
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