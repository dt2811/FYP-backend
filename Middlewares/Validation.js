async function ValidationMiddleware(req, res, next) {
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
    if (typeof (FirstName) === "undefined" || FirstName.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("FirstName");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("FirstName");
        }
    }
    if (typeof (LastName) === "undefined" || LastName.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("LastName");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("LastName");
        }
    }
    if (typeof (Address) === "undefined" || Address.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("Address");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("Address");
        }
    }
    if (typeof (State) === "undefined" || State.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("State");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("State");
        }
    }
    if (typeof (City) === "undefined" || City.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("City");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("City");
        }
    }
    if (typeof (Country) === "undefined" || Country.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("Country");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("Country");
        }
    }
    if (typeof (Coordinates) === "undefined" || Coordinates.length <= 0) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("Coordinates");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("Co0rindates");
        }
    }
    if (typeof (email) === "undefined" || EmailRegex.test(email) == false) {

        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("Email");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("Email");
        }
    }
    if (typeof (PhoneNumber) === "undefined" || PhoneRegex.test(PhoneNumber) == false) {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("Phone Number");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("Phone Number");
        }

    }
    if (typeof (IsFarmer) !== 'boolean') {
        message.isValid = false;
        if (message.missingFields) {
            var temp = Array.from(message.missingFields);
            temp.push("Account type");
            message.missingFields = temp;
        }
        else {
            message.missingFields = [];
            message.missingFields.push("Account type");
        }
    }
    if (typeof (IsFarmer) === 'boolean') {
        if (IsFarmer === false) {
            if (typeof (CompanyName) === "undefined" || CompanyName.length < 0) {
                message.isValid = false;
                if (message.missingFields) {
                    var temp = Array.from(message.missingFields);
                    temp.push("Companay name");
                    message.missingFields = temp;
                }
                else {
                    message.missingFields = [];
                    message.missingFields.push("Company Name");
                }

            }
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

module.exports = ValidationMiddleware;