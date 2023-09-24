let db = require("../../config/db");
let OTP = require("../../utils/randomNumber");
let sendOtp = require("../../utils/sendOtp");
let User = require("../../models/user");
let Appointment = require("../../models/bookAppointment");
let BookingTypeSchema = require("../../models/bookingType");
let Otp_verification = require("../../models/otp_verification");
let HospitalSchema = require("../../models/hospital");
let Doctor = require("../../models/doctors");
let DoctorStatusSchema = require("../../models/doctorStatus");
let bcrypt = require("bcryptjs");
let generateJwt = require("../../utils/jwt");
let push = require("../../utils/push");
const multer = require("multer");
const { s3uploadv2, localUpload } = require("../../utils/uploadNew");
let mailer = require("../../utils/mailer");


var ObjectId = require('mongoose').Types.ObjectId;

// exports.createUser = async (req, res) => {
//     // Validate request
//     if (!req.body) {
//         res.status(400).send({
//             message: "Content can not be empty!"
//         });
//     }
//     if (!req.body.FirstName) {
//         res.status(400).send({
//             message: "First name can not be empty!"
//         });
//     }
//     if (!req.body.LastName) {
//         res.status(400).send({
//             message: "Last name can not be empty!"
//         });
//     }
//     if (!req.body.MobileNumber) {
//         res.status(400).send({
//             message: "Mobile number can not be empty!"
//         });
//     }
//     if (!req.body.MobileNumber) {
//         res.status(400).send({
//             message: "Password can not be empty!"
//         });
//     }

//     const newUserOBj = {
//         FirstName: req.body.FirstName,
//         LastName: req.body.LastName,
//         MobileNumber: req.body.MobileNumber,
//         Password: req.body.Password
//     }

//     db.query("INSERT INTO user SET ?", newUserOBj, (err, result) => {
//         if (err) {
//             res.status(400).send({
//                 message: "Error while creating the user!",
//                 data: err
//             });
//             return
//         }
//         res.status(200).send({
//             message: "User registered successfully",
//             data: { id: result.insertId, ...newUserOBj }
//         });
//     })
// }

exports.createUser = async (req, res) => {
    // Validate request
    if (!req.body) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!req.body.FullName) {
        return res.send({
            status: 400,
            success: false,
            message: "Full name can not be empty!"
        });
    }
    if (!req.body.MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
    }
    if (!req.body.Email) {
        return res.send({
            status: 400,
            success: false,
            message: "Email can not be empty!"
        });
    }
    if (!req.body.Password) {
        return res.send({
            status: 400,
            success: false,
            message: "Password can not be empty!"
        });
    }

    try {
        let tokenObj = {
            fcmRegToken: "dwjwhwvckvkv",
            email: "user@gmail.com"
        }
        // let arn = await push.generateArn(tokenObj);
        // console.log("arn :", arn);

        let salt = bcrypt.genSaltSync(10);
        const newUserOBj = new User({
            FullName: req.body.FullName,
            MobileNumber: req.body.MobileNumber,
            Email: req.body.Email,
            Password: bcrypt.hashSync(req.body.Password, salt),
            Role: "user",
            DeviceToken: req.body.DeviceToken
        })

        newUserOBj.save()
            .then(data => {
                return res.send({
                    status: 200,
                    success: true,
                    message: "User registered successfully",
                    data: data
                });
            })
            .catch(err => {
                return res.send({
                    status: 400,
                    success: false,
                    message: "Error while creating the user!",
                    data: err
                });
            })
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

// exports.getUsers = async (req, res) => {
//     db.query("SELECT * FROM user", (err, result) => {
//         if (err) {
//             res.status(400).send({
//                 message: "Error while fetching the users!",
//                 data: err
//             });
//             return
//         }
//         res.status(200).send({
//             message: "Users found successfully",
//             data: result
//         });
//     })
// }

exports.getUsers = async (req, res) => {
    User.find()
        .then(data => {
            return res.send({
                status: 200,
                success: true,
                message: "Users found successfully",
                data: data
            });
        })
        .catch(err => {
            return res.send({
                status: 400,
                success: false,
                message: "Error while fetching the users!",
                data: err
            });
        })
}

exports.getUserDetails = async (req, res) => {
    let UserID = req.params.UserID;
    if (!UserID) {
        return res.send({
            status: 400,
            success: false,
            message: "User ID can not be empty!"
        });
    }
    try {
        User.findById(UserID)
            .then(data => {
                return res.send({
                    status: 200,
                    success: true,
                    message: "User details found successfully",
                    data: data
                });
            })
            .catch(err => {
                return res.send({
                    status: 400,
                    success: false,
                    message: "Error while fetching the user details!",
                    data: err
                });
            })
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


exports.checkUserExists = async (req, res) => {
    let MobileNumber = req.query.MobileNumber;
    if (!MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile Number can not be empty!"
        });
    }
    try {
        User.findOne({ MobileNumber: MobileNumber })
            .then(data => {
                if (data) {
                    res.send({
                        status: 200,
                        success: true,
                        message: "User exists",
                        data: data
                    });
                }
                else {
                    res.send({
                        status: 400,
                        success: false,
                        message: "User not found",
                        data: data
                    });
                }
            })
            .catch(err => {
                res.send({
                    status: 400,
                    success: false,
                    message: "Error while fetching the user!",
                    data: err
                });
            })
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


// exports.generateOTP = async (req, res) => {
//     // Validate request
//     if (!req.body) {
//         res.status(400).send({
//             message: "Content can not be empty!"
//         });
//         return
//     }
//     let { MobileNumber } = req.body
//     if (!MobileNumber) {
//         res.status(400).send({
//             message: "Mobile number can not be empty!"
//         });
//         return
//     }

//     let otp = OTP.randomNumberGenerator();
//     let sqlQuery1 = `SELECT * FROM otp_verification WHERE MobileNumber = ${MobileNumber}`;
//     let sqlQuery2 = `UPDATE otp_verification SET OTP = ${otp} WHERE MobileNumber = ${MobileNumber} `
//     let sqlQuery3 = `INSERT INTO otp_verification SET ?`;
//     db.query(sqlQuery1, (err, result) => {
//         if (err) {
//             res.status(400).send({
//                 message: "Error while fetching the otp details!",
//                 data: err
//             });
//             return
//         }
//         let otpObj = {
//             MobileNumber: MobileNumber,
//             OTP: otp
//         }
//         if (result && result.length > 0) {
//             db.query(sqlQuery2, (err2, result2) => {
//                 if (err2) {
//                     res.status(400).send({
//                         message: "Error while updating the otp!",
//                         data: err2
//                     });
//                     return
//                 }
//                 res.status(200).send({
//                     message: "OTP updated successfully",
//                     data: { result2, ...otpObj }
//                 });
//             })
//         }
//         else {
//             db.query(sqlQuery3, otpObj, (err3, result3) => {
//                 if (err3) {
//                     res.status(400).send({
//                         message: "Error while storing the otp!",
//                         data: err3
//                     });
//                     return
//                 }
//                 res.status(200).send({
//                     message: "OTP sent successfully",
//                     data: { id: result3.insertId, ...otpObj }
//                 });
//             })
//         }
//     })
// }


exports.generateOTP = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
        return
    }
    let { MobileNumber, Email } = req.body
    if (!MobileNumber) {
        res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
        return
    }
    if (!Email) {
        res.send({
            status: 400,
            success: false,
            message: "Email can not be empty!"
        });
        return
    }

    try {
        let otp = OTP.randomNumberGenerator();
        let user = await Otp_verification.findOne({ MobileNumber: MobileNumber });
        let otpObj = new Otp_verification({
            MobileNumber: MobileNumber,
            OTP: otp
        })
        if (user) {
            let otpUpdate = await Otp_verification.findByIdAndUpdate(user.id, { OTP: otp }, { new: true });
            if (otpUpdate) {
                //To send otp through mobile
                // let send = await sendOtp(MobileNumber, otp);

                //Email OTP
                let send = await mailer(MobileNumber, otp, Email);
                //    let send = await sendOtp();
                console.log("send 1:", send);
                return res.send({
                    status: 200,
                    success: true,
                    message: "OTP updated successfully",
                    data: otpUpdate
                });
            }
            else {
                return res.send({
                    status: 400,
                    success: false,
                    message: "Error while updating the otp!",
                    data: otpUpdate
                });
            }
        }
        else {
            otpObj.save()
                .then(async (data) => {
                    //Mobile OTP
                    // let send = await sendOtp(MobileNumber, otp);

                    //Email OTP
                    let send = await mailer(MobileNumber, otp,Email);
                    // let send = await sendOtp();
                    console.log("send 2:", send);
                    return res.send({
                        status: 200,
                        success: true,
                        message: "OTP sent successfully",
                        data: data
                    });
                })
                .catch(err => {
                    return res.send({
                        status: 400,
                        success: false,
                        message: "Error while storing the otp!",
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

// exports.verifyOTP = async (req, res) => {
//     // Validate request
//     if (!req.body) {
//         res.status(400).send({
//             message: "Content can not be empty!"
//         });
//         return
//     }
//     let { MobileNumber, OTP } = req.body
//     if (!MobileNumber) {
//         res.status(400).send({
//             message: "Mobile number can not be empty!"
//         });
//         return
//     }
//     if (!OTP) {
//         res.status(400).send({
//             message: "OTP can not be empty!"
//         });
//         return
//     }
//     let sqlQuery1 = `SELECT * FROM otp_verification WHERE MobileNumber = ${MobileNumber}`;
//     let sqlQuery2 = `DELETE FROM otp_verification WHERE MobileNumber = ${MobileNumber}`;
//     db.query(sqlQuery1, (err, result) => {
//         if (err) {
//             res.status(400).send({
//                 message: "Error while fetching the otp details!",
//                 data: err
//             });
//             return
//         }
//         if (result && result.length > 0) {
//             console.log("result :", result);
//             if (result[0].OTP == OTP) {
//                 db.query(sqlQuery2, (err2, result2) => {
//                     if (err2) {
//                         res.status(400).send({
//                             message: "Error while verifing the otp!",
//                             data: err2
//                         });
//                         return
//                     }
//                     res.status(200).send({
//                         message: "OTP verfied successfully",
//                         data: result[0]
//                     });
//                 })
//             }
//             else {
//                 res.status(400).send({
//                     message: "Incorrect OTP. Please try again..",
//                     data: {}
//                 });
//             }
//         }
//         else {
//             res.status(400).send({
//                 message: "No data found",
//                 data: result
//             });
//         }
//     })
// }

exports.verifyOTP = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
        return
    }
    let { MobileNumber, OTP } = req.body
    if (!MobileNumber) {
        res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
        return
    }
    if (!OTP) {
        res.send({
            status: 400,
            success: false,
            message: "OTP can not be empty!"
        });
        return
    }

    try {
        let user = await Otp_verification.findOne({ MobileNumber: MobileNumber });
        if (user) {
            if (user.OTP == OTP) {
                let deleteOtp = await Otp_verification.findByIdAndDelete(user.id)
                if (deleteOtp) {
                    res.send({
                        status: 200,
                        success: true,
                        message: "OTP verfied successfully",
                        data: user
                    });
                }
                else {
                    res.send({
                        status: 400,
                        success: false,
                        message: "Error while validating the OTP",
                        data: {}
                    });
                }
            }
            else {
                res.send({
                    status: 400,
                    success: false,
                    message: "Incorrect OTP. Please try again..",
                    data: {}
                });
            }
        }
        else {
            res.send({
                status: 400,
                success: false,
                message: "No data found",
                data: user
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

exports.login = async (req, res) => {
    if (!req.body.MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
    }
    if (!req.body.Password) {
        return res.send({
            status: 400,
            success: false,
            message: "Password can not be empty!"
        });
    }
    try {
        let user = await User.findOne({ MobileNumber: req.body.MobileNumber })
        if (user) {
            if (bcrypt.compareSync(req.body.Password, user.Password)) {
                let customToken = {
                    _id: user._id,
                    FullName: user.FullName,
                    MobileNumber: user.MobileNumber,
                    Role: user.Role,
                    Email: user.Email,
                    DeviceToken: user.DeviceToken,
                    Hospital: user.Hospital,
                    Doctor: user.Doctor
                }
                let accessToken = await generateJwt(customToken);
                customToken["token"] = await accessToken;
                res.send({
                    status: 200,
                    success: true,
                    message: "Logged-In successfully",
                    data: customToken
                });
            }
            else {
                res.send({
                    status: 400,
                    success: false,
                    message: "Incorrect password"
                });
            }
        }
        else {
            res.send({
                status: 400,
                success: false,
                message: "User not found"
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

exports.bookAppointment = async (req, res) => {
    let { UserID, HospitalID, DoctorID, BookingDate } = req.body;
    if (!UserID) {
        return res.send({
            status: 400,
            success: false,
            message: "User ID is missing!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID is missing!"
        });
    }
    if (!DoctorID) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor ID is missing!"
        });
    }
    if (!BookingDate) {
        return res.send({
            status: 400,
            success: false,
            message: "Booking Date can not be empty!"
        });
    }

    try {
        let doctorStatusData = await DoctorStatusSchema.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate });
        if (doctorStatusData && doctorStatusData.Activity === "disable") {
            console.log("not allowed for booking")
            return res.send({
                status: 400,
                success: false,
                message: "Doctor is not available for the selected Date"
            });
        }
        else {
            let appointments = await Appointment.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate }).sort({ 'createdAt': -1 });
            console.log("appointments :", appointments);
            if (appointments) {
                let newObj = new Appointment({
                    User: UserID,
                    Hospital: HospitalID,
                    Doctor: DoctorID,
                    BookingDate: BookingDate,
                    TokenNumber: appointments.TokenNumber + 2,
                    BookingType: appointments.BookingType
                })
                newObj.save()
                    .then(data => {
                        res.send({
                            status: 200,
                            success: true,
                            message: "Appointment booking done successfully",
                            data: data
                        });
                    })
                    .catch(err => {
                        res.send({
                            status: 400,
                            success: false,
                            message: "Error while booking the appointment!",
                            data: err
                        });
                    })
            }
            else {
                let bookingTypeData = await BookingTypeSchema.findOne({ Hospital: HospitalID, Doctor: DoctorID, BookingDate: BookingDate });
                var setBookingType;
                if (bookingTypeData) {
                    setBookingType = await bookingTypeData.BookingType
                }
                else {
                    setBookingType = await "odd";
                    const newBookTypeObj = new BookingTypeSchema({
                        BookingType: "odd",
                        BookingDate: BookingDate,
                        Hospital: HospitalID,
                        Doctor: DoctorID
                    });
                    await newBookTypeObj.save();
                }
                console.log("setBookingType :", setBookingType);
                let newObj = new Appointment({
                    User: UserID,
                    Hospital: HospitalID,
                    Doctor: DoctorID,
                    BookingDate: BookingDate,
                    TokenNumber: setBookingType ? (setBookingType === "odd" ? 1 : 2) : 1,
                    BookingType: setBookingType
                })
                await newObj.save()
                    .then(data => {
                        res.send({
                            status: 200,
                            success: true,
                            message: "Appointment booking done successfully",
                            data: data
                        });
                    })
                    .catch(err => {
                        res.send({
                            status: 400,
                            success: false,
                            message: "Error while booking the appointment!",
                            data: err
                        });
                    })
            }
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

exports.getHospitals = async (req, res) => {
    try {
        let hospitals = []
        if (req?.user?.Hospital) {
            hospitals = await HospitalSchema.find({ _id: ObjectId(req.user.Hospital) })
        }
        else {
            hospitals = await HospitalSchema.find()
        }
        if (hospitals) {
            res.send({
                status: 200,
                success: true,
                message: "Hospitals found successfully",
                data: hospitals
            });
        }
        else {
            res.send({
                status: 400,
                success: false,
                message: "No data found",
                data: hospitals
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

exports.getDoctorsByHospital = async (req, res) => {
    let hospitalId = req.query.hospitalId;
    if (!hospitalId) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital Id can not be empty!"
        });
    }

    try {
        let doctors = await Doctor.find({ Hospital: ObjectId(hospitalId) }).populate('Hospital');
        if (doctors) {
            res.send({
                status: 200,
                success: true,
                message: "Doctors found successfully",
                data: doctors
            });
        }
        else {
            res.send({
                status: 400,
                success: false,
                message: "No data found",
                data: doctors
            });
        }
    }
    catch (err) {
        res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.changePassword = async (req, res) => {
    let { oldPassword, newPassword, userId } = req.body;
    if (!oldPassword) {
        return res.send({
            status: 400,
            success: false,
            message: "Old password can not be empty!"
        });
    }
    if (!newPassword) {
        return res.send({
            status: 400,
            success: false,
            message: "New password can not be empty!"
        });
    }
    try {
        let user = await User.findById(userId);
        if (user) {
            if (bcrypt.compareSync(req.body.oldPassword, user.Password)) {
                let salt = bcrypt.genSaltSync(10);
                let Password = bcrypt.hashSync(newPassword, salt);
                let passwordUpdate = await User.findByIdAndUpdate(userId, { Password: Password });
                if (passwordUpdate) {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Password changed successfully",
                        data: passwordUpdate
                    });
                }
                else {
                    return res.send({
                        status: 400,
                        success: false,
                        message: "Error while changing the password"
                    });
                }
            }
            else {
                return res.send({
                    status: 400,
                    success: false,
                    message: "Incorrect old password"
                });
            }
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "User not found"
            });
        }
    }
    catch (err) {
        res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.forgotPasswordStep1 = async (req, res) => {
    let MobileNumber = req.body.MobileNumber;
    if (!MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile Number can not be empty!"
        });
    }
    try {
        let user = await User.findOne({ MobileNumber: MobileNumber });
        if (user) {
            let otp = OTP.randomNumberGenerator();
            let updateOtp = await User.findByIdAndUpdate(user.id, { OTP: otp }, { new: true });
            if (updateOtp) {
                let send = await sendOtp(MobileNumber, otp);
                res.send({
                    status: 200,
                    success: true,
                    message: "OTP sent for setting new password",
                    data: updateOtp
                });
            }
            else {
                return res.send({
                    status: 400,
                    success: false,
                    message: "Error while sending an otp"
                });
            }
        }
        else {
            res.send({
                status: 400,
                success: false,
                message: "User not found"
            });
        }
    }
    catch (err) {
        res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.forgotPasswordStep2 = async (req, res) => {
    let { MobileNumber, Password, OTP } = req.body;
    if (!MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile Number can not be empty!"
        });
    }
    if (!Password) {
        return res.send({
            status: 400,
            success: false,
            message: "Passwords can not be empty!"
        });
    }
    if (!OTP) {
        return res.send({
            status: 400,
            success: false,
            message: "OTP can not be empty!"
        });
    }
    try {
        let user = await User.findOne({ MobileNumber: MobileNumber });
        if (user) {
            if (user.OTP == OTP) {
                let salt = bcrypt.genSaltSync(10);
                let newPassword = bcrypt.hashSync(Password, salt);
                let updatePassword = await User.findOneAndUpdate(
                    { MobileNumber: MobileNumber },
                    { $set: { Password: newPassword } },
                    { new: true });
                if (updatePassword) {
                    return res.send({
                        status: 200,
                        success: true,
                        message: "Password updated successfully",
                        data: updatePassword
                    });
                }
                else {
                    return res.send({
                        status: 400,
                        success: false,
                        message: "Error while updating new password"
                    });
                }
            }
            else {
                return res.send({
                    status: 400,
                    success: false,
                    message: "Incorrect OTP"
                });
            }
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "User not found"
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

exports.updateDeviceToken = async (req, res) => {
    let { UserId, DeviceToken } = req.body;
    if (!req.body) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!UserId) {
        return res.send({
            status: 400,
            success: false,
            message: "user Id can not be empty!"
        });
    }
    if (!DeviceToken) {
        return res.send({
            status: 400,
            success: false,
            message: "Device token can not be empty!"
        });
    }
    try {
        let tokenUpdated = await User.findByIdAndUpdate(UserId, { DeviceToken: DeviceToken }, { new: true });
        if (tokenUpdated) {
            return res.send({
                status: 200,
                success: true,
                message: "Device token updated successfully",
                data: tokenUpdated
            });
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "Error while updating the device token!",
                data: err
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

exports.updateUser = async (req, res) => {
    let { UserId, FullName, Email, Location } = req.body;
    if (!req.body) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!UserId) {
        return res.send({
            status: 400,
            success: false,
            message: "user Id can not be empty!"
        });
    }
    if (!FullName) {
        return res.send({
            status: 400,
            success: false,
            message: "Full Name can not be empty!"
        });
    }
    if (!Email) {
        return res.send({
            status: 400,
            success: false,
            message: "Email can not be empty!"
        });
    }
    try {
        let userUpdated = await User.findByIdAndUpdate(UserId, { FullName: FullName, Email: Email, FileLocation: Location }, { new: true });
        if (userUpdated) {
            return res.send({
                status: 200,
                success: true,
                message: "User updated successfully",
                data: userUpdated
            });
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "Error while updating the user!",
                data: err
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


//Used for uploading files to s3
exports.fileUpload_To_S3 = async (req, res) => {
    try {
        const file = req.file;
        if (!req.file) {
            return res.send({
                status: 400,
                success: false,
                message: "Please select a file to upload",
                data: null
            });
        }
        else if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            const result = await s3uploadv2(file);
            return res.send({
                status: 200,
                success: true,
                message: "File uploaded successfully",
                data: result
            });
        } else {
            return res.send({
                status: 400,
                success: false,
                message: "Invalid file type, only JPEG and PNG is allowed!",
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

exports.fileUpload = async (req, res) => {
    try {
        const file = req.file;
        if (!req.file) {
            return res.send({
                status: 400,
                success: false,
                message: "Please select a file to upload",
                data: null
            });
        }
        else if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            return res.send({
                status: 200,
                success: true,
                message: "File uploaded successfully",
                data: req.file
            });
        } else {
            return res.send({
                status: 400,
                success: false,
                message: "Invalid file type, only JPEG and PNG is allowed!",
                data: null
            });
        }
    }
    catch (err) {
        console.log("err :",err);
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}


exports.getBookingDetails = async (req, res) => {
    let { UserId, HospitalID, DoctorID, BookingDate } = req.query;
    if (!req.query) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!UserId) {
        return res.send({
            status: 400,
            success: false,
            message: "User Id can not be empty!"
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
    if (!BookingDate) {
        return res.send({
            status: 400,
            success: false,
            message: "Booking Date can not be empty!"
        });
    }
    try {
        let appointment = await Appointment.findOne({ Hospital: HospitalID, Doctor: DoctorID, User: UserId, BookingDate: BookingDate })
            .populate('Hospital')
            .populate('Doctor');
        // .sort({ 'createdAt': -1 });
        if (appointment) {
            return res.send({
                status: 200,
                success: true,
                message: "Appointment details found successfully",
                data: appointment
            });
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "There is no appointment",
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


exports.changethis = async (req, res) => {

}