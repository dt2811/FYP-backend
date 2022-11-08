function NewCropValidation(req,res){
    var Name = req.body.Name;
    var Description = req.body.Description;
    var Images = req.body.Images;
    var message = {};
if (typeof (Name) === "undefined" || Name.length <= 0) {
    message.isValid = false;
    if (message.missingFields) {
        var temp = Array.from(message.missingFields);
        temp.push("Name");
        message.missingFields = temp;
    }
    else {
        message.missingFields = [];
        message.missingFields.push("Name");
    }
}
if (typeof (Description) === "undefined" || Description.length <= 0) {
    message.isValid = false;
    if (message.missingFields) {
        var temp = Array.from(message.missingFields);
        temp.push("Description");
        message.missingFields = temp;
    }
    else {
        message.missingFields = [];
        message.missingFields.push("Description");
    }
}
if (typeof (Images) === "undefined" || Images.length <= 0) {
    message.isValid = false;
    if (message.missingFields) {
        var temp = Array.from(message.missingFields);
        temp.push("Images");
        message.missingFields = temp;
    }
    else {
        message.missingFields = [];
        message.missingFields.push("Images");
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

module.exports = NewCropValidationMiddleware;