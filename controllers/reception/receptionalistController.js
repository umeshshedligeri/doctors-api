const BookingTypeSchema = require("../../models/bookingType");
const DoctorStatusSchema = require("../../models/doctorStatus");
const TokenQueueSchema = require("../../models/tokenQueue");
let Appointment = require("../../models/bookAppointment");
let Doctor = require("../../models/doctors");
let User = require("../../models/user");
var ObjectId = require('mongoose').Types.ObjectId;
const Config = require("../../config/application");
const axios = require('axios');


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
            // res.send({
            //     status: 400,
            //     success: false,
            //     message: "Doctor status already there for selected date and doctor",
            //     data: doctorStatusData
            // });

            let updateDoctorStatus = await DoctorStatusSchema.findByIdAndUpdate(doctorStatusData._id,
                {
                    Activity: Activity
                },
                { new: true }
            )
            if (updateDoctorStatus) {
                let doctorsData = await Doctor.findOne({ _id: ObjectId(DoctorID), Hospital: HospitalID }).populate("Hospital");
                console.log("doctorsData :", doctorsData);
                if (doctorsData) {
                    let url = "https://fcm.googleapis.com/fcm/send";
                    let fcmServerKey = Config.fcm_server_key;
                    let deviceTokens = []
                    let users = await User.find();
                    if (users) {
                        users.map(u => {
                            deviceTokens.push(u.DeviceToken);
                        })
                    }
                    console.log("deviceTokens :", deviceTokens);
                    let bodyDisable = `${doctorsData.Hospital.Name} hospital's Doctor ${doctorsData.FirstName} ${doctorsData.LastName} is not available on: ${BookingDate}. Please choose some other dates for consultation.`
                    let bodyEnable = `${doctorsData.Hospital.Name} hospital's Doctor ${doctorsData.FirstName} ${doctorsData.LastName} is available on: ${BookingDate}. Please take consultation as per your slot.`
                    let notificationObj = {
                        "registration_ids": deviceTokens,
                        "notification": {
                            "title": Activity === "enable" ? "Doctor is available!" : "Doctor is not available!",
                            // "body": `${doctorsData.Hospital.Name} hospital's Doctor ${doctorsData.FirstName} ${doctorsData.LastName} is not available on: ${BookingDate}. Please choose some other dates for consultation.`,
                            "body": Activity === "enable" ? bodyEnable : bodyDisable,
                            "sound": "default"
                        }
                    }

                    var config = {
                        headers: { 'Authorization': 'Bearer  ' + fcmServerKey },
                    };

                    let sendNotification = await axios.post(url, notificationObj, config)
                    console.log("sendNotification :", sendNotification)
                }
                res.send({
                    status: 200,
                    success: true,
                    message: "Doctor Activity updated successfully",
                    data: updateDoctorStatus
                });
            }
            else {
                res.send({
                    status: 400,
                    success: false,
                    message: "Error while updating doctor status",
                });
            }
        }
        else {
            const newObj = new DoctorStatusSchema({
                Activity: Activity,
                BookingDate: BookingDate,
                Hospital: HospitalID,
                Doctor: DoctorID
            });
            newObj.save()
                .then(async (data) => {
                    let doctorsData = await Doctor.findOne({ _id: ObjectId(DoctorID), Hospital: HospitalID }).populate("Hospital");
                    console.log("doctorsData :", doctorsData);
                    if (doctorsData) {
                        let url = "https://fcm.googleapis.com/fcm/send";
                        let fcmServerKey = Config.fcm_server_key;
                        let deviceTokens = []
                        let users = await User.find();
                        if (users) {
                            users.map(u => {
                                deviceTokens.push(u.DeviceToken);
                            })
                        }
                        console.log("deviceTokens :", deviceTokens);
                        let notificationObj = {
                            "registration_ids": deviceTokens,
                            "notification": {
                                "title": "Doctor is not available!",
                                "body": `${doctorsData.Hospital.Name} hospital's Doctor ${doctorsData.FirstName} ${doctorsData.LastName} is not available on: ${BookingDate}. Please choose some other dates for consultation.`,
                                "sound": "default"
                            }
                        }

                        var config = {
                            headers: { 'Authorization': 'Bearer  ' + fcmServerKey },
                        };

                        let sendNotification = await axios.post(url, notificationObj, config)
                        console.log("sendNotification :", sendNotification)
                    }
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
                let url = "https://fcm.googleapis.com/fcm/send";
                let fcmServerKey = Config.fcm_server_key;
                let deviceTokens = []

                let appointmentsData = await Appointment.find({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate }).populate('User');;
                console.log("appointmentsData :", appointmentsData);
                if (appointmentsData) {
                    appointmentsData.map(ap => {
                        deviceTokens.push(ap?.User?.DeviceToken)
                    })
                }
                // let appointments = appointmentsData.filter(a => a.TokenNumber >= CurrentToken)
                console.log("deviceTokens :", deviceTokens);
                let notificationObj = {
                    "registration_ids": deviceTokens,
                    "notification": {
                        "title": "Token update!",
                        "body": `Your doctor ongoing token is : ${CurrentToken}. Reach your hospital before your token passes!. Please ignore if consultation done already.`,
                        "sound": "default"
                    }
                }

                var config = {
                    headers: { 'Authorization': 'Bearer  ' + fcmServerKey },
                };

                let sendNotification = await axios.post(url, notificationObj, config)
                console.log("sendNotification :", sendNotification)
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

//gbdkvnjjbl