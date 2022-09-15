let db = require("../../config/db");
let OTP = require("../../utils/randomNumber");
let sendOtp = require("../../utils/sendOtp");
let User = require("../../models/user");
let Appointment = require("../../models/bookAppointment");
let BookingTypeSchema = require("../../models/bookingType");
let Otp_verification = require("../../models/otp_verification");
let HospitalSchema = require("../../models/hospital");
let Doctor = require("../../models/doctors");
let bcrypt = require("bcryptjs");

let generateJwt = require("../../utils/jwt");


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
            message: "First name can not be empty!"
        });
    }
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
        let salt = bcrypt.genSaltSync(10);
        const newUserOBj = new User({
            FullName: req.body.FullName,
            MobileNumber: req.body.MobileNumber,
            Password: bcrypt.hashSync(req.body.Password, salt),
            Role: "user"
        })

        newUserOBj.save()
            .then(data => {
                res.send({
                    status: 200,
                    success: true,
                    message: "User registered successfully",
                    data: data
                });
            })
            .catch(err => {
                res.send({
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
            res.send({
                status: 200,
                success: true,
                message: "Users found successfully",
                data: data
            });
        })
        .catch(err => {
            res.send({
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
                res.send({
                    status: 200,
                    success: true,
                    message: "Users found successfully",
                    data: data
                });
            })
            .catch(err => {
                res.send({
                    status: 400,
                    success: false,
                    message: "Error while fetching the users!",
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
    let { MobileNumber } = req.body
    if (!MobileNumber) {
        res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
        return
    }

    // try {
        let otp = OTP.randomNumberGenerator();
        let user = await Otp_verification.findOne({ MobileNumber: MobileNumber });
        let otpObj = new Otp_verification({
            MobileNumber: MobileNumber,
            OTP: otp
        })
        if (user) {
            let otpUpdate = await Otp_verification.findByIdAndUpdate(user.id, { OTP: otp });
            if (otpUpdate) {
               let send = await sendOtp(MobileNumber,otp);
            //    let send = await sendOtp();
               console.log("send 1:",send);
                res.send({
                    status: 200,
                    success: true,
                    message: "OTP updated successfully",
                    data: otpUpdate
                });
            }
            else {
                res.send({
                    status: 400,
                    success: false,
                    message: "Error while updating the otp!",
                    data: otpUpdate
                });
            }
        }
        else {
            otpObj.save()
                .then(async(data) => {
                    let send = await sendOtp(MobileNumber,otp);
                    // let send = await sendOtp();
                    console.log("send 2:",send);
                    res.send({
                        status: 200,
                        success: true,
                        message: "OTP sent successfully",
                        data: data
                    });
                })
                .catch(err => {
                    res.send({
                        status: 400,
                        success: false,
                        message: "Error while storing the otp!",
                        data: err
                    });
                })
        }
    // }
    // catch (err) {
    //     return res.send({
    //         status: 400,
    //         success: false,
    //         message: "Something went wrong",
    //         data: err
    //     });
    // }
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
                    Role: user.Role
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
        let hospitals = await HospitalSchema.find();
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