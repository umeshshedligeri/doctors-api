const BookingTypeSchema = require("../../models/bookingType");
const DoctorStatusSchema = require("../../models/doctorStatus");


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