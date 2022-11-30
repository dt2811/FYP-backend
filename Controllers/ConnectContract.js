require('dotenv').config();
var fs = require('fs');
var ethers = require('ethers')
const fsPromises = fs.promises;

// INSTRUCTION: DO NOT CONNECT WITH BACKEND BEFORE VALIDATING IF THIS WORKS!!!!

//TODO: 
//Error Handling All
//Checking if this works

class ContractController {

    constructor() {
        this.contract = this.init();
    }

    async getAbi() {
        const data = await fsPromises.readFile(process.env.ABI_FILE_PATH, 'utf8');
        const abi = JSON.parse(data)['abi'];
        console.log(abi);
        return abi;
    }

    async init() {
        const ethProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
        const ethSigner = ethProvider.getSigner();
        const abi = await this.getAbi();
        const ethContract = new ethers.Contract(
            process.env.DEPLOYED_CONTRACT_ADDRESS,
            abi,
            ethSigner
        );
        return ethContract;
    }

    async initBlockFarmer(req, res) {
        try {
            const newcontract = this.contract;
            let transaction = await newcontract.initTransactionBlockFarmer(
                req.body.createdAt, //EDIT THIS LATER
                req.body.CropId,
                req.body.CropQuantity, //EDIT FOR CROPDETAILS
                req.body.CropPrice, //EDIT FOR CROPDETAILS
                req.user.Coordinates, // EDIT FOR LATITUDE
                req.user.Coordinates //EDIT FOR LONGITUDE
            )
            var transactionID = await transaction.wait();
            return transactionID;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }

    async initBlockStore() {
        try {
            const newcontract = this.contract;
            let transaction = await newcontract.initTransactionBlockStore(
                req.body.createdAt, //EDIT THIS LATER
                req.body.CropId,
                req.body.CropQuantity, //EDIT FOR CROPDETAILS
                req.body.CropPrice, //EDIT FOR CROPDETAILS
                req.user.Coordinates, // EDIT FOR LATITUDE
                req.user.Coordinates //EDIT FOR LONGITUDE
            )
            var transactionID = await transaction.wait();
            return transactionID;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }

    async farmerAcceptRequest(req, res) {
        try {
            const newcontract = this.contract;
            let transaction = await newcontract.farmerAcceptRequest(
                req.body.transactionID,
                req.user.Coordinates, // EDIT FOR LATITUDE
                req.user.Coordinates //EDIT FOR LONGITUDE
            )
            await transaction.wait();
            return;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }

    async storeAcceptRequest() {
        try {
            const newcontract = this.contract;
            let transaction = await newcontract.storeAcceptRequest(
                req.body.transactionID,
                req.user.Coordinates, // EDIT FOR LATITUDE
                req.user.Coordinates //EDIT FOR LONGITUDE
            )
            await transaction.wait();
            return;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }
    async completeRequest() {
        try {
            const newcontract = this.contract;
            let transaction = await newcontract.completeRequest(
                req.body.transactionID,
             
            )
            await transaction.wait();
            return;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }

    async deleteRequest() {
        try {
            const newcontract = this.contract;
            let transaction = await newcontract.deleteRequest(
                req.body.transactionID,
             
            )
            await transaction.wait();
            return;
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Contract Error!' });
        }
    }
}