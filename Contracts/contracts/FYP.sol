//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract FYP {
    int256 public transactions = 0;
    mapping(int256 => Transaction) public TransactionLedger;

    enum TransactionStatus {
        Requested,
        Accepted,
        Completed,
        Cancelled
    }

    enum Initiator {
        Farmer,
        Store
    }
    
    struct Transaction {
        int256 transactionID;
        address farmerAddress;
        address storeAddress;
        uint256 dateRequestPosted;
        uint256 dateRequestAccepted;
        int256 cropID;
        int256 cropQuantity;
        int256 cropPrice;
        TransactionStatus transactionStatus;
    }

    function initTransactionBlock(
        uint256 dateRequestPosted,
        int256 cropID,
        int256 cropQuantity,
        int256 cropPrice,
        bool initByFarmer
    ) public returns (int256) {
        address farmerAddress = 0x0000000000000000000000000000000000000000;
        address storeAddress = 0x0000000000000000000000000000000000000000;
        if (initByFarmer) {
            farmerAddress = msg.sender;
        } else {
            storeAddress = msg.sender;
        }
        TransactionLedger[transactions] = Transaction({
            transactionID: transactions,
            farmerAddress: farmerAddress,
            storeAddress: storeAddress,
            dateRequestPosted: dateRequestPosted,
            dateRequestAccepted: block.timestamp,
            cropID: cropID,
            cropQuantity: cropQuantity,
            cropPrice: cropPrice,
            transactionStatus: TransactionStatus.Requested
        });
        transactions += 1;
        return transactions;
    }

    function acceptRequest(
        int256 transactionID,
        bool initByFarmer
    ) public {
        require(
            TransactionLedger[transactionID].transactionStatus ==
                TransactionStatus.Requested
        );
        if (initByFarmer) {
            TransactionLedger[transactionID].farmerAddress = msg.sender;
        } else {
            TransactionLedger[transactionID].storeAddress = msg.sender;
        }
        TransactionLedger[transactionID].transactionStatus =
                TransactionStatus.Accepted;
    }

    function completeRequest(int256 transactionID) public {
        require(
            TransactionLedger[transactionID].transactionStatus ==
                TransactionStatus.Accepted
        );
        TransactionLedger[transactionID].transactionStatus = TransactionStatus
            .Completed;
    }

    function deleteRequest(int256 transactionID) public {
        require(
            TransactionLedger[transactionID].transactionStatus !=
                TransactionStatus.Completed
        );
        TransactionLedger[transactionID].transactionStatus = TransactionStatus
            .Cancelled;
    }
}
