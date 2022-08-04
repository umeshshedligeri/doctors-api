const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorsSchema = new Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    MobileNumber: Number,
    Hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'hospital' },
    Speciality: { type: String, required: true }
});

module.exports = mongoose.model("doctor", doctorsSchema);