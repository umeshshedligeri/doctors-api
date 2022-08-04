let db = require("../../config/db");
let OTP = require("../../utils/randomNumber");
let User = require("../../models/user");
let Otp_verification = require("../../models/otp_verification");

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
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    if (!req.body.FirstName) {
        res.status(400).send({
            message: "First name can not be empty!"
        });
    }
    if (!req.body.LastName) {
        res.status(400).send({
            message: "Last name can not be empty!"
        });
    }
    if (!req.body.MobileNumber) {
        res.status(400).send({
            message: "Mobile number can not be empty!"
        });
    }
    if (!req.body.Password) {
        res.status(400).send({
            message: "Password can not be empty!"
        });
    }

    const newUserOBj = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        MobileNumber: req.body.MobileNumber,
        Password: req.body.Password,
        Role : "user"
    })

    newUserOBj.save()
        .then(data => {
            res.status(200).send({
                message: "User registered successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(400).send({
                message: "Error while creating the user!",
                data: err
            });
        })
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
            res.status(200).send({
                message: "Users found successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(400).send({
                message: "Error while fetching the users!",
                data: err
            });
        })
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
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return
    }
    let { MobileNumber } = req.body
    if (!MobileNumber) {
        res.status(400).send({
            message: "Mobile number can not be empty!"
        });
        return
    }

    let otp = OTP.randomNumberGenerator();
    let user = await Otp_verification.findOne({ MobileNumber: MobileNumber });
    let otpObj = new Otp_verification({
        MobileNumber: MobileNumber,
        OTP: otp
    })
    if (user) {
        let otpUpdate = await Otp_verification.findByIdAndUpdate(user.id, { OTP: otp });
        if (otpUpdate) {
            res.status(200).send({
                message: "OTP updated successfully",
                data: otpUpdate
            });
        }
        else {
            res.status(400).send({
                message: "Error while updating the otp!",
                data: otpUpdate
            });
        }
    }
    else {
        otpObj.save()
            .then(data => {
                res.status(200).send({
                    message: "OTP sent successfully",
                    data: data
                });
            })
            .catch(err => {
                res.status(400).send({
                    message: "Error while storing the otp!",
                    data: err
                });
            })
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
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return
    }
    let { MobileNumber, OTP } = req.body
    if (!MobileNumber) {
        res.status(400).send({
            message: "Mobile number can not be empty!"
        });
        return
    }
    if (!OTP) {
        res.status(400).send({
            message: "OTP can not be empty!"
        });
        return
    }

    let user = await Otp_verification.findOne({ MobileNumber: MobileNumber });
    if (user) {
        if (user.OTP == OTP) {
            let deleteOtp = await Otp_verification.findByIdAndDelete(user.id)
            if (deleteOtp) {
                res.status(200).send({
                    message: "OTP verfied successfully",
                    data: user
                });
            }
            else {
                res.status(400).send({
                    message: "Error while validating the OTP",
                    data: {}
                });
            }
        }
        else {
            res.status(400).send({
                message: "Incorrect OTP. Please try again..",
                data: {}
            });
        }
    }
    else {
        res.status(400).send({
            message: "No data found",
            data: user
        });
    }
}

exports.login = async (req, res) => {
    if (!req.body.MobileNumber) {
        res.status(400).send({
            message: "Mobile number can not be empty!"
        });
    }
    if (!req.body.Password) {
        res.status(400).send({
            message: "Password can not be empty!"
        });
    }
    let user = await User.findOne({ MobileNumber: req.body.MobileNumber })
    if (user) {
        if (user.Password === req.body.Password) {
            res.status(200).send({
                message: "Logged-In successfully",
                data: user
            });
        }
        else {
            res.status(400).send({
                message: "Incorrect password"
            });
        }
    }
    else {
        res.status(400).send({
            message: "User not found"
        });
    }
}
