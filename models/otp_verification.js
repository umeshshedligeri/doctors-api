const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    MobileNumber: { type: Number, required: true },
    OTP: { type: Number, required: true }
});

module.exports = mongoose.model("otp_verification", otpSchema);