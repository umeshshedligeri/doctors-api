const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    Name : { type : String, required : true },
    Address : { type : String, required : true},
    City : {type : String,required : true}
});

module.exports = mongoose.model("hospital", hospitalSchema );