function NewCompanyPostingValidation(req,res,next ){
    var CropId = req.body.CropId;
    var Details = req.body.Details;
    var Quantity=req.body.Quantity;
    var message = {};
if (typeof (Details) === "undefined" || Details.length <= 0) {
    message.isValid = false;
    if (message.missingFields) {
        var temp = Array.from(message.missingFields);
        temp.push("Details");
        message.missingFields = temp;
    }
    else {
        message.missingFields = [];
        message.missingFields.push("Details");
    }
}
if (typeof (CropId) === "undefined" || CropId.length <= 0) {
    message.isValid = false;
    if (message.missingFields) {
        var temp = Array.from(message.missingFields);
        temp.push("CropId");
        message.missingFields = temp;
    }
    else {
        message.missingFields = [];
        message.missingFields.push("CropId");
    }
}
if (typeof(Quantity) === "undefined" || Quantity.length <= 0) {
    message.isValid = false;
    if (message.missingFields) {
        var temp = Array.from(message.missingFields);
        temp.push("Qauntity");
        message.missingFields = temp;
    }
    else {
        message.missingFields = [];
        message.missingFields.push("Qauntity");
    }
}
if (Object.keys(message).length === 0) {
    message.isValid = true;
    req.body.validation = message;
}
else {
    req.body.validation = message;
}
next();
}

module.exports = NewCompanyPostingValidation;