const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookAppointmentSchema = new Schema({
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    Hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'hospital' },
    Doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    TokenNumber: { type: Number, required: true },
    BookingType: { type: String, required: true },
    BookingDate : { type : Date,required : true},
    // Created_At: { type: Date, required: true, default: new Date() }
},{ timestamps: {} });

module.exports = mongoose.model("appointment", bookAppointmentSchema);