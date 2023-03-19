//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract FYP {
    int256 public transactions = 0;
    int256 public postings = 0;
    mapping(string => Transaction) public TransactionLedger;
    mapping(string => Posting) public PostingLedger;

    enum TransactionStatus {
        Accepted,
        Cancelled
    }

    enum PostingStatus {
        Created,
        Deleted
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

    struct Posting{
        int256 postingNo;
        bool isFarmerPosting;
        string posterId;
        string cropId;
        string quantity;
        string details;
        string price;
        PostingStatus postingStatus;
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

    function initPostBlock(
        bool isFarmerPosting,
        string memory postingID,
        string memory posterId,
        string memory cropId,
        string memory cropQuantity,
        string memory cropDetails,
        string memory cropPrice
    ) public returns (int256){
        PostingLedger[postingID] = Posting({
            postingNo: postings,
            isFarmerPosting: isFarmerPosting,
            posterId: posterId,
            cropId: cropId,
            quantity: cropQuantity,
            details: cropDetails,
            price: cropPrice,
            postingStatus: PostingStatus.Created
        });
        postings += 1;
        return postings;
    }

    function deleteRequest(string memory requestId) public {
        require(
            TransactionLedger[requestId].transactionStatus ==
                TransactionStatus.Accepted
        );
        TransactionLedger[requestId].transactionStatus = TransactionStatus
            .Cancelled;
    }

    function deletePost(string memory postId) public {
        require(
            PostingLedger[postId].postingStatus ==
                PostingStatus.Created
        );
        PostingLedger[postId].postingStatus =
                PostingStatus.Deleted;
    }

}
