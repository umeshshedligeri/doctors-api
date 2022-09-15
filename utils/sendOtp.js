var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIA2XEJXDWSPAFB5I5U',
    secretAccessKey: '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',
    region: 'ap-south-1'
});



const sendOTP = async(mobileNo, otp) => {
    var mobileNo = "+91"+mobileNo;
    var OTP = otp;

    // var params1 = {
    //     Protocol: 'sms',
    //     TopicArn: 'arn:aws:sns:ap-south-1:736875716004:WhiteHealth',
    //     Endpoint: '+917760019217'
    //   };
    //   new AWS.SNS().subscribe(params1, function(err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else     console.log(data);           // successful response
    //   });

    var params = {
        Message: "Welcome! your mobile verification code is: " + OTP + "     Mobile Number is:" + mobileNo, /* required */
        PhoneNumber: mobileNo,
    };
    return new AWS.SNS({ apiVersion: '2022–09–13' }).publish(params)
        .promise()
        .then(message => {
            console.log("OTP SEND SUCCESS");
        })
        .catch(err => {
            console.log("Error " + err)
            return err;
        });
}

module.exports = sendOTP

