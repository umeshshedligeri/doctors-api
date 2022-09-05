const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    FullName : { type : String, required : true, max : [500, "Max Length is 500 characters"] },
    MobileNumber : Number,
    Password : { type : String, required : true},
    Role : {type : String,required: true}
});

module.exports = mongoose.model("user", userSchema );