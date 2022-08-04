const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    FirstName : { type : String, required : true, max : [127, "Max Length is 127 characters"] },
    LastName : { type : String, required : true},
    MobileNumber : Number,
    Password : { type : String, required : true},
    Role : {type : String,required: true}
});

module.exports = mongoose.model("user", userSchema );