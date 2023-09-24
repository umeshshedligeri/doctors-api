const nodemailer = require("nodemailer");
const mailer = async (mobileNo, otp,Email) => {
    let mailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'whitehealth2022@gmail.com',
            pass: 'rfui hnfy qprf twqe'
        },
    });
     
    let mailDetails = {
        from: 'whitehealth2022@gmail.com',
        to: Email,
        subject: "OTP verification", // Subject line
        html: `<h4>Welcome to Whitehealth!</h4> <br> Your email verification code is :<b> ${otp} </b> <br><br> Please verify your account with OTP.<br><br>Thanks,<br>White Health`, // plain text body
    };
     
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs',err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = mailer