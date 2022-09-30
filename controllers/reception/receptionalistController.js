const BookingTypeSchema = require("../../models/bookingType");
const DoctorStatusSchema = require("../../models/doctorStatus");
const TokenQueueSchema = require("../../models/tokenQueue");


exports.updateBookingType = async (req, res) => {
    let { BookingType, BookingDate, HospitalID, DoctorID } = req.body;
    if (!BookingType) {
        return res.send({
            status: 400,
            success: false,
            message: "Booking Type can not be empty!"
        });
    }
    if (!BookingDate) {
        return res.send({
            status: 400,
            success: false,
            message: "Booking Date can not be empty!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    if (!DoctorID) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor ID can not be empty!"
        });
    }
    try {
        let bookingTypeData = await BookingTypeSchema.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate });
        if (bookingTypeData) {
            res.send({
                status: 400,
                success: false,
                message: "Booking type already there for selected date and doctor",
                data: bookingTypeData
            });
        }
        else {
            const newObj = new BookingTypeSchema({
                BookingType: BookingType,
                BookingDate: BookingDate,
                Hospital: HospitalID,
                Doctor: DoctorID
            });
            newObj.save()
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Booking type added successfully",
                        data: data
                    });
                })
                .catch(err => {
                    res.send({
                        status: 400,
                        success: false,
                        message: "Error while adding booking type",
                        data: err
                    });
                })
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.setDoctorActivity = async (req, res) => {
    let { Activity, BookingDate, HospitalID, DoctorID } = req.body;
    if (!Activity) {
        return res.send({
            status: 400,
            success: false,
            message: "Activity can not be empty!"
        });
    }
    if (!BookingDate) {
        return res.send({
            status: 400,
            success: false,
            message: "Booking Date can not be empty!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    if (!DoctorID) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor ID can not be empty!"
        });
    }
    try {
        let doctorStatusData = await DoctorStatusSchema.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate });
        if (doctorStatusData) {
            res.send({
                status: 400,
                success: false,
                message: "Doctor status already there for selected date and doctor",
                data: doctorStatusData
            });
        }
        else {
            const newObj = new DoctorStatusSchema({
                Activity: Activity,
                BookingDate: BookingDate,
                Hospital: HospitalID,
                Doctor: DoctorID
            });
            newObj.save()
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Doctor Activity added successfully",
                        data: data
                    });
                })
                .catch(err => {
                    res.send({
                        status: 400,
                        success: false,
                        message: "Error while adding doctor status",
                        data: err
                    });
                })
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.updateTokenQueue = async (req, res) => {
    let { CurrentToken, BookingDate, HospitalID, DoctorID } = req.body;
    if (!CurrentToken) {
        return res.send({
            status: 400,
            success: false,
            message: "Current Token can not be empty!"
        });
    }
    if (!BookingDate) {
        return res.send({
            status: 400,
            success: false,
            message: "Booking Date can not be empty!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    if (!DoctorID) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor ID can not be empty!"
        });
    }
    try {
        let tokenQueueData = await TokenQueueSchema.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate });
        if (tokenQueueData) {
            let tokenUpdate = await TokenQueueSchema.findByIdAndUpdate(tokenQueueData.id, { CurrentToken: CurrentToken });
            if (tokenUpdate) {
                res.send({
                    status: 200,
                    success: true,
                    message: "Token queue updated successfully",
                    data: tokenUpdate
                });
            }
            else {
                res.send({
                    status: 400,
                    success: false,
                    message: "Error while updating the token queue",
                    data: tokenUpdate
                });
            }
        }
        else {
            const updateTokenObj = new TokenQueueSchema({
                CurrentToken: CurrentToken,
                BookingDate: BookingDate,
                Hospital: HospitalID,
                Doctor: DoctorID
            });
            updateTokenObj.save()
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Token queue updated successfully",
                        data: data
                    });
                })
                .catch(err => {
                    res.send({
                        status: 400,
                        success: false,
                        message: "Error while updating the token queue",
                        data: err
                    });
                })
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.getTokenQueue = async (req, res) => {
    let { BookingDate, HospitalID, DoctorID } = req.query;
    if (!BookingDate) {
        return res.send({
            status: 400,
            success: false,
            message: "Booking Date can not be empty!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    if (!DoctorID) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor ID can not be empty!"
        });
    }
    try {
        let tokenQueueData = await TokenQueueSchema.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate });
        if (tokenQueueData) {
            res.send({
                status: 200,
                success: true,
                message: "Token queue found successfully",
                data: tokenQueueData
            });
        }
        else {
            res.send({
                status: 400,
                success: false,
                message: "Queue is not yet started",
                data: tokenQueueData
            });
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.getDoctorActivity = async (req, res) => {
    let { BookingDate, HospitalID, DoctorID } = req.query;
    if (!BookingDate) {
        return res.send({
            status: 400,
            success: false,
            message: "Booking Date can not be empty!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    if (!DoctorID) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor ID can not be empty!"
        });
    }
    try {
        let doctorStatusData = await DoctorStatusSchema.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate });
        if (doctorStatusData && doctorStatusData.Activity === "disable") {
            return res.send({
                status: 400,
                success: false,
                message: "Doctor is not available for the selected Date"
            });
        }
        else {
            return res.send({
                status: 200,
                success: true,
                message: "Doctor is available for booking",
                data: null
            });
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}