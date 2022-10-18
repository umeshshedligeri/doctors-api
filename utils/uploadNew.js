const {S3,AWS} = require("aws-sdk");

exports.s3uploadv2 = async(file) =>{
    const s3 = new S3(
        {
            secretAccessKey: "maxS+E9TmO+/SAll7z7pl77+hoGJ7o6Ha7/8zXku",
            accessKeyId: "AKIA2XEJXDWSDEURU5FC",
            region: 'us-east-1'
          }
    );
    const params= {
        Bucket : "whitehealthfiles",
        Key : "uploads/"+ Date.now() + file.originalname,
        Body : file.buffer,
    }
    return await s3.upload(params).promise();
}