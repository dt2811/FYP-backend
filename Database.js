require('dotenv').config();
const mongoose = require('mongoose');
function connectToDb() {
    mongoose.connect(process.env.Db_url , {}, function (error) {
        if (error) {
            console.log("DB error occured"+error)
        }
        else {
            console.log("DB CONNECTION DONE");
            
        }
    });
}
module.exports=connectToDb;