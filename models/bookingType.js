const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingTypeSchema = new Schema({
    Hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'hospital' },
    Doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    BookingType: { type: String, required: true },
    BookingDate : { type : Date,required : true},
    // Created_At: { type: Date, required: true, default: new Date() }
},{ timestamps: {} });

module.exports = mongoose.model("bookingtype", bookingTypeSchema);