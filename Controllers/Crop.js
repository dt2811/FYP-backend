const e = require('express');
const Crops = require('../Models/Crop');
class UserController {

    async registerNewUser(req, res) {  // REGISTER NEW USER
        try {
            var Name = req.body.Name;
            var Description = req.body.Description;
            var Images = req.body.Images;
            var isValid = req.body.validation['isValid'];
            if (isValid === true) {
                    const crops = new Crops({
                       Name:Name,
                       Description:Description,
                       Images:Images,
                    });
                    result = await crops.save(); // ADDING crop AFTER VALIDATIONS
                    if (result) {
                        res.status(200).send({ message: 'Crop succesfully', data: result });
                        return;
                    }
                    else {
                        res.status(400).send(req.body.validation);
                    }
                }
            }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }
    async CropDetails(req, res) {
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
            const results=Crops.find();
            if(results){
            res.status(200).send({data:results});}
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
module.exports = new UserController();