function sendOTP(){
    var mobileNo = "+919931021948";
    var OTP = generateRandomNumber(1000,9999);
    
    var params = {
    Message: "Welcome! your mobile verification code is: " + OTP +"     Mobile Number is:" +mobileNo, /* required */
      PhoneNumber: mobileNo,
      };
      return new AWS.SNS({apiVersion: '2010–03–31'}).publish(params).promise()
 .then(message => {
 console.log("OTP SEND SUCCESS");
 })
 .catch(err => {
 console.log("Error "+err)
 return err;});
 }
 sendOTP();//calling send otp function