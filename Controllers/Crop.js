const Crops = require('../Models/Crop');
class CropController {

    async registerNewCrop(req, res) {  // REGISTER NEW CROP
        try {
            var Name = req.body.Name;
            var Description = req.body.Description;
            var Images = req.body.Images;
            var isValid = req.body.validation['isValid'];
            if (isValid === true) {
                    var crops = new Crops({
                       Name:Name,
                       Description:Description,
                       Images:Images,
                    });
                    
                    var result = await crops.save(); // ADDING CROP AFTER VALIDATIONS
                    if (result) {
                        res.status(200).send({ message: 'Crop succesfully', data: result });
                        return;
                    }
                    else{
                        res.status(400).send({ error: 'Error occured at backend!!' });
                    }
                }
                else {
                    res.status(400).send(req.body.validation);
                }
            }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }
    async updateCropDetails(req, res) {
        var id = req.body._id;
        try {
            if (req.body.isSaved === true) {
                var result = await Crops.findOneAndUpdate({_id: id}, req.body.data); // CHECKING IF THE USER IS THERE OR NOT
                if (result) {
                    res.status(200).send({ Success: 'Crop saved', user: result });
                }
                else {
                    res.status(400).send({ error: "Error occured while saving at backend" });
                }
            }
            else {
                res.status(200).send({ Success: 'Crop saved', user: req.body.user });
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });

        }
    }

    async getCropDetails(req, res) {
        try {
            var results=await Crops.find();
            var data=[]
            if(results){
                results.forEach((result, index) => { // ADDING STATION DETAILS TO THE OBJECT
                    var tempObj = Object.assign({}, result['_doc']);
                    data.push(tempObj);
                });
            res.status(200).send({data:data});}
            else{
                res.status(400).send({error:"Couldnt fetch"});
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }
}
module.exports = new CropController ();