const { S3, AWS } = require("aws-sdk");
const multer = require("multer");

exports.s3uploadv2 = async (file) => {
    const s3 = new S3(
        {
            secretAccessKey: "WLNN5pxao0mUNYfkXzG6Nj4vMYhx+3satbNEFKOe",
            accessKeyId: "AKIA5SIHM2L2OBM4BVOI",
            region: 'ap-south-1'
        }
    );
    const params = {
        Bucket: "whitehealthfiles2023",
        Key: "uploads/" + Date.now() + file.originalname,
        Body: file.buffer,
    }
    return await s3.upload(params).promise();
}

exports.localUpload = async (file) => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });
    var upload = multer({ storage: storage }).single('photo');

    return upload
    // upload(req, res, function (err) {
    //     if (err) {
    //         return res.send({
    //             status: 400,
    //             success: false,
    //             message: "Invalid file type, only JPEG and PNG is allowed!",
    //             data: null
    //         });
    //     }

    //     if (!req.files) {
    //         return res.send({
    //             status: 400,
    //             success: false,
    //             message: "Invalid file type, only JPEG and PNG is allowed!",
    //             data: null
    //         });
    //     } else {
    //         //Implement your own logic if needed. Like moving the file, renaming the file, etc.
    //         return res.send({
    //             status: 400,
    //             success: false,
    //             message: "Invalid file type, only JPEG and PNG is allowed!",
    //             data: null
    //         });
    //     }
    // });
}