const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenQueueSchema = new Schema({
    Hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'hospital' },
    Doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    CurrentToken: { type: Number, required: true },
    BookingDate: { type: Date, required: true },
    // Created_At: { type: Date, required: true, default: new Date() }
}, { timestamps: {} });

module.exports = mongoose.model("tokenqueue", tokenQueueSchema);