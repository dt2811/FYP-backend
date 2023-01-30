//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract FYP {
    int256 public transactions = 0;
    mapping(string => Transaction) public TransactionLedger;

    enum TransactionStatus {
        Accepted,
        Cancelled
    }

    event TransactionBlockInitialized(int256 transactionID);

    struct Transaction {
        int256 transactionID;
        string farmerId;
        string companyId;
        string requestId;
        uint256 dateRequestPosted;
        uint256 dateRequestAccepted;
        TransactionStatus transactionStatus;
    }

    function initTransactionBlock(
        uint256 dateRequestPosted,
        string memory farmerId,
        string memory companyId,
        string memory requestId
    ) public returns (int256) {
        TransactionLedger[requestId] = Transaction({
            transactionID: transactions,
            farmerId: farmerId,
            companyId: companyId,
            requestId: requestId,
            dateRequestPosted: dateRequestPosted,
            dateRequestAccepted: block.timestamp,
            transactionStatus: TransactionStatus.Accepted
        });
        emit TransactionBlockInitialized(transactions);
        transactions += 1;
        return transactions;
    }

    function deleteRequest(string memory requestId) public {
        require(
            TransactionLedger[requestId].transactionStatus ==
                TransactionStatus.Accepted
        );
        TransactionLedger[requestId].transactionStatus = TransactionStatus
            .Cancelled;
    }
}
