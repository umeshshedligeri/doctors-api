const BookingTypeSchema = require("../../models/bookingType");


exports.updateBookingType = async (req, res) => {
    let { BookingType, BookingDate, HospitalID, DoctorID } = req.body;
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