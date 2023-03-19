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
        // For Deployment on Goerli Testnet / Sepolia Testnet 
        // const contractEndpoint = process.env.GORLI_ETH_ENDPOINT;
        // const walletPrivateKey = process.env.ETHEREUM_ACCOUNT_PRIVATE_KEY;
        // const contractAddress = process.env.DEPLOYED_CONTRACT_ADDRESS;
       

        // For Testing Purposes on Ganache Local Blockchain 
        const contractEndpoint = process.env.GANACHE_ETH_ENDPOINT;
        const walletPrivateKey = process.env.ETHEREUM_ACCOUNT_PRIVATE_KEY_GANACHE;
        const contractAddress = process.env.DEPLOYED_CONTRACT_ADDRESS_GANACHE;

        // For Testing Purposes 
        const ethProvider = new ethers.providers.JsonRpcProvider(contractEndpoint);

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

    async initTransactionBlock(RequestData) {
        try {
            // Initialize response object
            var blockchainResponse = {};

            // Print deplyed address
            console.log("Contract Deployed at Address: ", this.contract.address);

            // Get the deployed contract
            const newcontract = this.contract;

            // Get the Data Object from the Middleware (Dead now because there's no middleware involved now)
            // var RequestData = req.body.data;

            // Create Empty response object
            var TransactionResponse = {};

            // Log the incoming Request data to the Console
            // console.log(RequestData);

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

                blockchainResponse.status = 'Successful';
                blockchainResponse.message = 'Transaction Added to Blockchain';
                blockchainResponse.data = TransactionResponse;

                // OG response
                // res.status(200).send({ message: 'Transaction Added to Blockchain', data: TransactionResponse });
                return blockchainResponse;
            }
        } catch (error) {
            console.log(error)

            blockchainResponse.status = 'Unsuccessful';
            blockchainResponse.message = 'Contract Error!';
            // OG Response
            // res.status(400).send({ error: 'Contract Error!' });
            return blockchainResponse;
        }
    }

    async initPostBlock(RequestData) {
        try {
            // Initialize response object
            var blockchainResponse = {};

            // Print deplyed address
            console.log("Contract Deployed at Address: ", this.contract.address);

            // Get the deployed contract
            const newcontract = this.contract;

            // Get the Data Object from the Middleware (Dead now because there's no middleware involved now)
            // var RequestData = req.body.data;

            // Create Empty response object
            var TransactionResponse = {};

            // Log the incoming Request data to the Console
            // console.log(RequestData);

            // Call the initPostBlock function
            let transaction = await newcontract.initPostBlock(
                RequestData.IsFarmer,
                RequestData.PostingID,
                RequestData.UserId,
                RequestData.CropId,
                RequestData.CropQuantity,
                RequestData.CropDetails,
                RequestData.CropPrice
            );

            // Wait for the reply from Blockchain
            var transactionReply = await transaction.wait();

            // Check Point for Transaction Reply
            // console.log("Checkpoint #1: ", transactionReply);

            // Get the details of the TransactionLedger mapping from the Blockchain
            transactionReply = await newcontract.PostingLedger(
                RequestData.PostingID
            );

            if (transactionReply) {

                // Checkpoint #2:  [
                //     BigNumber { _hex: '0x00', _isBigNumber: true },
                //     false,
                //     '8356968871',
                //     '640c5d04ce2a7455e1d7edb5',
                //     '150kg',
                //     'Description: Made by Company Om Turmerix 2',
                //     'Rs. 100000',
                //     0,
                //     postingNo: BigNumber { _hex: '0x00', _isBigNumber: true },
                //     isFarmerPosting: false,
                //     postingStatus: 0
                //   ]

                TransactionResponse.BlockchainPostingID = ethers.utils.formatUnits(transactionReply[0], 0);
                TransactionResponse.UserId = transactionReply[2];

                // Check Point for Transaction Reply
                // console.log("Checkpoint #2: ", transactionReply);

                blockchainResponse.status = 'Successful';
                blockchainResponse.message = 'Transaction Added to Blockchain';
                blockchainResponse.data = TransactionResponse;

                // OG response
                // res.status(200).send({ message: 'Transaction Added to Blockchain', data: TransactionResponse });
                return blockchainResponse;
            }
        } catch (error) {
            console.log(error)

            blockchainResponse.status = 'Unsuccessful';
            blockchainResponse.message = 'Contract Error!';
            // OG Response
            // res.status(400).send({ error: 'Contract Error!' });
            return blockchainResponse;
        }
    }

    async deletePost(RequestData) {
        try {

            // Initialize response object
            var blockchainResponse = {};

            // Get Deployed Contract
            const newcontract = this.contract;

            // Get the Request Id
            var postingId = RequestData.PostingID;

            // Call the Contract Function
            let transaction = await newcontract.deletePost(
                postingId
            );

            // Wait for reply
            var transactionReply = await transaction.wait();
            if (transactionReply) {
                // OG Res
                // res.status(200).send({ message: 'Transaction Deleted', data: transactionReply });

                blockchainResponse.status = "Successful";
                blockchainResponse.message = "Posting Deleted";
                blockchainResponse.data = transactionReply;
                return blockchainResponse;
            }
            return;
        } catch (error) {
            // Log error to console
            console.log(error)

            // Fill up response object
            blockchainResponse.status = "Unsuccessful";
            blockchainResponse.message = "Contract Error!";
            // res.status(400).send({ error: 'Contract Error!' });

            return blockchainResponse;
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

    async getRequestDetails(RequestData) {
        try {

            // Initialize response object
            var blockchainResponse = {};

            // Get Deployed Contract
            const newcontract = this.contract;

            // Get the Request Id
            var requestId = RequestData.RequestId;

            // Call the Contract Function
            let transaction = await newcontract.TransactionLedger(
                requestId
            );

            console.log("HIII: ", transaction);
            // Wait for reply

            if (transaction) {
                // OG Res
                // res.status(200).send({ message: 'Transaction Deleted', data: transactionReply });

                blockchainResponse.status = "Successful";
                blockchainResponse.message = "Transaction Details Retrieved";
                blockchainResponse.data = transactionReply;
                return blockchainResponse;
            }
            return;
        } catch (error) {
            // Log error to console
            console.log(error)

            // Fill up response object
            blockchainResponse.status = "Unsuccessful";
            blockchainResponse.message = "Contract Error!";
            // res.status(400).send({ error: 'Contract Error!' });

            return blockchainResponse;
        }
    }

    async deleteRequest(RequestData) {
        try {

            // Initialize response object
            var blockchainResponse = {};

            // Get Deployed Contract
            const newcontract = this.contract;

            // Get the Request Id
            var requestId = RequestData.RequestId;

            // Call the Contract Function
            let transaction = await newcontract.deleteRequest(
                requestId
            );

            // Wait for reply
            var transactionReply = await transaction.wait();
            if (transactionReply) {
                // OG Res
                // res.status(200).send({ message: 'Transaction Deleted', data: transactionReply });

                blockchainResponse.status = "Successful";
                blockchainResponse.message = "Transaction Deleted";
                blockchainResponse.data = transactionReply;
                return blockchainResponse;
            }
            return;
        } catch (error) {
            // Log error to console
            console.log(error)

            // Fill up response object
            blockchainResponse.status = "Unsuccessful";
            blockchainResponse.message = "Contract Error!";
            // res.status(400).send({ error: 'Contract Error!' });

            return blockchainResponse;
        }
    }
}

module.exports = new ContractController(); 