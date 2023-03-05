const {S3,AWS} = require("aws-sdk");

exports.s3uploadv2 = async(file) =>{
    const s3 = new S3(
        {
            secretAccessKey: "WLNN5pxao0mUNYfkXzG6Nj4vMYhx+3satbNEFKOe",
            accessKeyId: "AKIA5SIHM2L2OBM4BVOI",
            region: 'ap-south-1'
          }
    );
    const params= {
        Bucket : "whitehealthfiles2023",
        Key : "uploads/"+ Date.now() + file.originalname,
        Body : file.buffer,
    }
    return await s3.upload(params).promise();
}