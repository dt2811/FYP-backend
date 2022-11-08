async function UpdateValidationMiddleware(req, res, next) {
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var IsFarmer = req.body.IsFarmer;
    var Address = req.body.Address;
    var State = req.body.State;
    var City = req.body.City;
    var Country = req.body.Country;
    var Coordinates = req.body.Coordinates;
    var CompanyName = req.body.CompanyName;
    var email = req.body.Email;
    var PhoneNumber = req.body.PhoneNumber;
    const PhoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    const EmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var message = {};
    if (typeof (FirstName) !== "undefined" && FirstName.length >= 0) {
      message.FirstName=FirstName;
    }
    if (typeof (LastName) !== "undefined" && LastName.length >= 0) {
        message.LastName=LastName;
    }
    if (typeof (Address) !== "undefined" && Address.length >= 0) {
        message.Address=Address;
    }
    if (typeof (State) !== "undefined" && State.length >= 0) {
       message.State=State;
    }
    if (typeof (City) !== "undefined" && City.length >= 0) {
      message.City=City;
    }
    if (typeof (Country) !== "undefined" && Country.length >= 0) {
        message.Country=Country;
    }
    if (typeof (Coordinates) !== "undefined" && Coordinates.length >= 0) {
       message.Coordinates=Coordinates;
    }
    if (typeof (email) !== "undefined" && EmailRegex.test(email) == true) {
     message.Email=email;
    }
    if (typeof (IsFarmer) === 'boolean') {
       message.IsFarmer=IsFarmer;
       if(IsFarmer===false){
        message.CompanyName=CompanyName;
       }
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

module.exports = UpdateValidationMiddleware;