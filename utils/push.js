var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
});

var sns = new AWS.SNS();

var platform_arn = ''; // save in constants on device as 'android' or 'ios'
var device_token = ''; // push token id when user login and save in database
var user_data = ''; //first name and last name for aws console

//ceate ARN  
sns.createPlatformEndpoint({
    PlatformApplicationArn: platform_arn,
    Token: device_token,
    CustomUserData: user_data
}, (err, data) => {
    if (err) {
        console.log(err.stack);
        return;
    }
    else {
        console.log(data.EndpointArn);    //save in DB : DEVICE_ARN : to send push notification
    }
});


//delete ARN
var device_arn = 'arn:aws:sns:us-east-1:XXXXXXXX:endpoint/GCM/notification_name/id'; //SEND DEVICE_ARN
sns.deleteEndpoint({
    EndpointArn: device_arn
}, (err, data) => {
    if (err) {
        console.log(err.stack);
        return;
    }
    else {
        console.log(data.ResponseMetadata.RequestId);
    }
});


//send push
var device_arn = 'arn:aws:sns:us-east-1:554906049655:endpoint/GCM/notification_name/id'; //Called from db : DEVICE_ARN

var params = {
    Attributes: {
        Enabled: 'true',
    },
    EndpointArn: device_arn
};

sns.setEndpointAttributes(params, (err, data) => {
    if (err) {
        console.log(err.stack);
        return;
    }
    else {
        console.log(data.ResponseMetadata.RequestId);
        console.log('push enable');

        var payload = {
            default: 'Hello World',
            APNS: {
                aps: {
                    alert: 'Hello World',
                    sound: 'default',
                    badge: 1
                }
            }
        };

        payload.APNS = JSON.stringify(payload.APNS);
        payload = JSON.stringify(payload);

        sns.publish({
            Message: payload,
            MessageStructure: 'json',
            TargetArn: device_arn
        }, (err, data) => {
            if (err) {
                console.log(err.stack);
                return;
            }
            else {
                console.log(data.ResponseMetadata.RequestId);
                console.log('push sent');
            }
        });
    }
});