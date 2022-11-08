async function UpdateFarmerPostingValidationMiddleware(req, res, next) {
    var CropId = req.body.CropId;
    var Details = req.body.Details;
    var Quantity=req.body.Quantity;
    var ImageUrls = req.body.ImageUrls;
    var postId=req.body._id;
    var message = {};
    if (typeof (postId) !== "undefined" && postId.length >= 0) {
        message.postId=postId;
      }
    if (typeof (CropId) !== "undefined" && CropId.length >= 0) {
      message.CropId=CropId;
    }
    if (typeof (Details) !== "undefined" && Details.length >= 0) {
        message.CropId=Details;
    }
    if (typeof (ImageUrls) !== "undefined" && ImageUrls.length >= 0) {
        message.ImageUrls=ImageUrls;
    }
    if (typeof (Quantity) !== "undefined" && Quantity.length >= 0) {
        message.Quantity=Quantity;
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

module.exports = UpdateFarmerPostingValidationMiddleware;