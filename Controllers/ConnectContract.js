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
        this.acceptRequest = this.acceptRequest.bind(this);
        // console.log(this.contract.address)
        // console.log(this.contract.functions)
    }

    getAbi() {
        // IF CONTRACT IS UPDATED PLEASE UPDATE THIS ABI, IK IT'S SUPER STUPID BUT IDK WHAT ELSE TO DO
        const abi = [
            "function initTransactionBlock(uint256 dateRequestPosted, int256 cropID, int256 cropQuantity, int256 cropPrice, bool initByFarmer) public returns (int256)",
            "function acceptRequest(int256 transactionID, bool initByFarmer) public",
            "function completeRequest(int256 transactionID) public",
            "function deleteRequest(int256 transactionID) public"
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
            const newcontract = this.contract;
            var createdAt = req.body.createdAt;
            var CropId = req.body.CropId;
            var CropQuantity = req.body.CropQuantity;
            var CropPrice = req.body.CropPrice;
            // var isFarmer = req.body.isFarmer;
            var isFarmer = true;

            let transaction = await newcontract.initTransactionBlock(
                createdAt, //EDIT THIS LATER
                CropId,
                CropQuantity, //EDIT FOR CROPDETAILS
                CropPrice, //EDIT FOR CROPDETAILS
                isFarmer
            )
            var transactionReply = await transaction.wait();
            if (transactionReply) {
                res.status(200).send({ message: 'Accept succesfully', data: transactionReply });
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
            const newcontract = this.contract;
            var transactionId = req.body.transactionId;
            let transaction = await newcontract.deleteRequest(
                transactionId,
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
}

module.exports = new ContractController(); 