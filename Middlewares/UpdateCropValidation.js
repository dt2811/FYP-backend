async function UpdateCropValidationMiddleware(req, res, next) {
    var Name = req.body.Name;
    var Description = req.body.Description;
    var Images = req.body.Images;
    var message = {};
    if (typeof (Name) !== "undefined" && Name.length >= 0) {
      message.Name=Name;
    }
    if (typeof (Description) !== "undefined" && Description.length >= 0) {
        message.Description=Description;
    }
    if (typeof (Images) !== "undefined" && Images.length >= 0) {
        message.Images=Images;
    }
    if (Object.keys(message).length === 0) {
    req.body.isSaved=false;
    }
    else {
        req.body.isSaved=true;
    }

    req.body.data = message;
    next();
}

module.exports = UpdateCropValidationMiddleware;