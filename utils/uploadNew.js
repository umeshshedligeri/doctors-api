const {S3} = require("aws-sdk");
exports.s3uploadv2 = async(file) =>{
    const s3 = new S3();
    const params= {
        Bucket : "whitehealthfiles",
        Key : "uploads/"+ Date.now() + file.originalname,
        Body : file.buffer,
    }
    return await s3.upload(params).promise();
}