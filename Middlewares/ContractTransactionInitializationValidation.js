function ContractTransactionInitializationValidationMiddleware(req, res, next) {
    var createdAt = req.body.createdAt;
    var farmerId = req.body.FarmerId;
    var companyId = req.body.CompanyId;
    var requestId = req.body.RequestId;

    console.log(req.body);
    var data = {};
    var message = {};

    if (typeof (createdAt) === "undefined" || createdAt.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("createdAt");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("createdAt");
        }
    } else {
        data.createdAt = createdAt;
    }

    if (typeof (farmerId) === "undefined" || farmerId.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("farmerId");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("farmerId");
        }
    } else {
        data.farmerId = farmerId;
    }

    if (typeof (companyId) === "undefined" || companyId.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("companyId");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("companyId");
        }
    } else {
        data.companyId = companyId;
    }

    if (typeof (requestId) === "undefined" || requestId.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("requestId");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("requestId");
        }
    } else {
        var requestId = req.body.RequestId;
        data.requestId = requestId;
    }

    if (Object.keys(message).length === 0) {
        message.isValid = true;
        req.body.validation = message;
        req.body.data = data;
    }
    else {
        console.log(message);
        req.body.validation = message;
        req.body.data = data;
    }
    next();


}

module.exports = ContractTransactionInitializationValidationMiddleware;