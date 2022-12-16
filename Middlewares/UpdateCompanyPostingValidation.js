async function UpdateCompanyPostingValidationMiddleware(req, res, next) {
    var CropId = req.body.CropId;
    var Details = req.body.Details;
    var Quantity = req.body.Quantity;
    var postId = req.body._id;
    var Price=req.body.Price;
    var message = {};
    if (typeof (postId) !== "undefined" && postId.length >= 0) {
        message.postId = postId;
    }
    if (typeof (CropId) !== "undefined" && CropId.length >= 0) {
        message.CropId = CropId;
    }
    if (typeof (Details) !== "undefined" && Details.length >= 0) {
        message.Details = Details;
    }
    if (typeof (Quantity) !== "undefined" && Quantity.length >= 0) {
        message.Quantity = Quantity;
    }
    if (typeof (Price) !== "undefined" && Price.length >= 0) {
        message.Price=Price;
      }
    if (Object.keys(message).length === 0) {
        req.body.isSaved = false;
    }
    else {
        req.body.isSaved = true;
    }

    req.body.data = message;
    next();
}

module.exports = UpdateCompanyPostingValidationMiddleware;