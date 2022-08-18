const BookingTypeSchema = require("../../models/bookingType");


exports.updateBookingType = async (req, res) => {
    let { BookingType, BookingDate, HospitalID, DoctorID } = req.body;
    let bookingTypeData = await BookingTypeSchema.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate });
    if (bookingTypeData) {
        res.status(400).send({
            message: "Booking type already there for selected date and doctor",
            data: err
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
                res.status(200).send({
                    message: "Booking type added successfully",
                    data: data
                });
            })
            .catch(err => {
                res.status(400).send({
                    message: "Error while adding booking type",
                    data: err
                });
            })
    }
}