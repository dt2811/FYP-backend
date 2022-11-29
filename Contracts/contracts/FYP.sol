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

    struct coordinates {
        int256 latitude;
        int256 longitude;
    }

    struct Transaction {
        int256 transactionID;
        address farmerAddress;
        address storeAddress;
        uint256 dateRequestPosted;
        uint256 dateRequestAccepted;
        coordinates farmerCoordinates;
        coordinates storeCoordinates;
        int256 cropID;
        int256 cropQuantity;
        int256 cropPrice;
        TransactionStatus transactionStatus;
    }

    function initTransactionBlockStore(
        uint256 dateRequestPosted,
        int256 cropID,
        int256 cropQuantity,
        int256 cropPrice,
        int256 storeLatitude,
        int256 storeLongitude
    ) public {
        TransactionLedger[transactions] = Transaction({
            transactionID: transactions,
            farmerAddress: 0x0000000000000000000000000000000000000000,
            storeAddress: msg.sender,
            dateRequestPosted: dateRequestPosted,
            dateRequestAccepted: block.timestamp,
            farmerCoordinates: coordinates({latitude: 0, longitude: 0}),
            storeCoordinates: coordinates({
                latitude: storeLatitude,
                longitude: storeLongitude
            }),
            cropID: cropID,
            cropQuantity: cropQuantity,
            cropPrice: cropPrice,
            transactionStatus: TransactionStatus.Requested
        });
        transactions += 1;
    }

    function initTransactionBlockFarmer(
        uint256 dateRequestPosted,
        int256 cropID,
        int256 cropQuantity,
        int256 cropPrice,
        int256 farmerLatitude,
        int256 farmerLongitude
    ) public {
        TransactionLedger[transactions] = Transaction({
            transactionID: transactions,
            farmerAddress: msg.sender,
            storeAddress: 0x0000000000000000000000000000000000000000,
            dateRequestPosted: dateRequestPosted,
            dateRequestAccepted: block.timestamp,
            farmerCoordinates: coordinates({
                latitude: farmerLatitude,
                longitude: farmerLongitude
            }),
            storeCoordinates: coordinates({latitude: 0, longitude: 0}),
            cropID: cropID,
            cropQuantity: cropQuantity,
            cropPrice: cropPrice,
            transactionStatus: TransactionStatus.Requested
        });
        transactions += 1;
    }

    function farmerAcceptRequest(
        int256 transactionID,
        int256 farmerLatitude,
        int256 farmerLongitude
    ) public {
        require(
            TransactionLedger[transactionID].farmerAddress ==
                0x0000000000000000000000000000000000000000
        );
        require(
            TransactionLedger[transactionID].transactionStatus ==
                TransactionStatus.Requested
        );
        TransactionLedger[transactionID].farmerAddress = msg.sender;
        TransactionLedger[transactionID].farmerCoordinates = coordinates({
            latitude: farmerLatitude,
            longitude: farmerLongitude
        });
    }

    function storeAcceptRequest(
        int256 transactionID,
        int256 storeLatitude,
        int256 storeLongitude
    ) public {
        require(
            TransactionLedger[transactionID].storeAddress ==
                0x0000000000000000000000000000000000000000
        );
        require(
            TransactionLedger[transactionID].transactionStatus ==
                TransactionStatus.Requested
        );
        TransactionLedger[transactionID].storeAddress = msg.sender;
        TransactionLedger[transactionID].storeCoordinates = coordinates({
            latitude: storeLatitude,
            longitude: storeLongitude
        });
        TransactionLedger[transactionID].transactionStatus = TransactionStatus
            .Accepted;
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
