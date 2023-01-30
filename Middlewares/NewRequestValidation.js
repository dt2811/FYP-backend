function NewRequestValidationMiddleware(req, res, next) {
    var RequestInitiatorId = req.body.user.PhoneNumber;
    // var RequestTargetEthId = 
    var PostingId = req.body.PostingId;
    var Message = req.body.Message;

    console.log(req.body);
    var message = {};
    var data = {};

    if (typeof (RequestInitiatorId) === "undefined" || RequestInitiatorId.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("RequestInitiatorId");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("RequestInitiatorId");
        }
    } else {
        data.RequestInitiatorId = RequestInitiatorId;
    }

    if (typeof (PostingId) === "undefined" || PostingId.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("PostingId");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("PostingId");
        }
    } else {
        data.PostingId = PostingId;
    }

    if (typeof (Message) === "undefined" || Message.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("Message");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("Message");
        }
    } else {
        data.Message = Message;
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

module.exports = NewRequestValidationMiddleware;