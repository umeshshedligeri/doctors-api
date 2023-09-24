var AWS = require('aws-sdk');
const Config = require("../config/application");

AWS.config.update({
    accessKeyId: 'AKIA5SIHM2L2OBM4BVOI',
    secretAccessKey: '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',
    region: 'ap-south-1'
});

var sns = new AWS.SNS();


const generateArn = (tokenObj) => {
    let params = {
        PlatformApplicationArn: Config.platFormApplicationArn,
        Token: tokenObj.fcmRegToken,
        CustomUserData: tokenObj.email
    }
    return new Promise(async (resolve, reject) => {
        try {
            await sns.createPlatformEndpoint(params, (err, data) => {
                if (err) {
                    console.log("Error :", err);
                    return;
                }
                else {
                    resolve({ data })
                    console.log("device token", data.EndpointArn);    //save in DB : DEVICE_ARN : to send push notification
                }
            });
        }
        catch (e) {
            reject(e)
        }
    })
}

const publishNotification = async (targetArn, payload) => {
    let params = {
        Message: JSON.stringify({
            GCM: payload
        }),
        MessageStructure: "json",
        TargetArn: `${targetArn}`
    }
    console.log("sending push :", params);
    return new Promise(async (resolve, reject) => {
        try {
            let paramsCheck = {
                EndpointArn: `${targetArn}`
            }
            await sns.getEndpointAttributes(paramsCheck, (err, data) => {
                if (err) {
                    console.log("Error :", err, err.stack);
                }
                else {
                    console.log("data :", data);
                    if (data && data.Attributes && data.Attributes.Enabled == "true") {
                        sns.publish(params, (err, data) => {
                            if (err) {
                                console.log("Error in sending push notification :", err);
                            }
                            else {
                                console.log("Push notifcation sent successfully :", data);
                                resolve(true)
                            }
                        })
                    }
                    else {
                        resolve(false)
                    }
                }
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

// var platform_arn = "arn:aws:sns:ap-south-1:736875716004:app/BAIDU/DoctorApplication"; // save in constants on device as 'android' or 'ios'
// var device_token = ''; // push token id when user login and save in database
// var user_data = ''; //first name and last name for aws console

// //ceate ARN
// sns.createPlatformEndpoint({
//     PlatformApplicationArn: platform_arn,
//     Token: device_token,
//     CustomUserData: user_data
// }, (err, data) => {
//     if (err) {
//         console.log(err.stack);
//         return;
//     }
//     else {
//         console.log("device token", data.EndpointArn);    //save in DB : DEVICE_ARN : to send push notification
//     }
// });


//delete ARN
// var device_arn = 'arn:aws:sns:us-east-1:XXXXXXXX:endpoint/GCM/notification_name/id'; //SEND DEVICE_ARN
// sns.deleteEndpoint({
//     EndpointArn: device_arn
// }, (err, data) => {
//     if (err) {
//         console.log(err.stack);
//         return;
//     }
//     else {
//         console.log(data.ResponseMetadata.RequestId);
//     }
// });


//send push
// var device_arn = 'arn:aws:sns:us-east-1:554906049655:endpoint/GCM/notification_name/id'; //Called from db : DEVICE_ARN

// var params = {
//     Attributes: {
//         Enabled: 'true',
//     },
//     EndpointArn: device_arn
// };

// sns.setEndpointAttributes(params, (err, data) => {
//     if (err) {
//         console.log(err.stack);
//         return;
//     }
//     else {
//         console.log(data.ResponseMetadata.RequestId);
//         console.log('push enable');

//         var payload = {
//             default: 'Hello World',
//             APNS: {
//                 aps: {
//                     alert: 'Hello World',
//                     sound: 'default',
//                     badge: 1
//                 }
//             }
//         };

//         payload.APNS = JSON.stringify(payload.APNS);
//         payload = JSON.stringify(payload);

//         sns.publish({
//             Message: payload,
//             MessageStructure: 'json',
//             TargetArn: device_arn
//         }, (err, data) => {
//             if (err) {
//                 console.log(err.stack);
//                 return;
//             }
//             else {
//                 console.log(data.ResponseMetadata.RequestId);
//                 console.log('push sent');
//             }
//         });
//     }
// });

module.exports = {
    generateArn,
    publishNotification
}