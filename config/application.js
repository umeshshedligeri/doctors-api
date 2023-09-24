let environmentDetails = require('dotenv').config().parsed
module.exports = {
    host: environmentDetails.HOST,
    user: environmentDetails.USERNAME,
    password: environmentDetails.PASSWORD,
    dbName: environmentDetails.DBNAME,
    secret_key: environmentDetails.SECRET_KEY,
    platFormApplicationArn: environmentDetails.PLATFORM_APPLICATION_ARN,
    fcm_server_key: environmentDetails.FCM_SERVER_KEY
}