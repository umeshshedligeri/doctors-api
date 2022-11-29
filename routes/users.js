var express = require('express');
var router = express.Router();
let userController = require("../controllers/user/userController");
const auth = require("../middlewares/auth");
var multer = require('multer')
const storage = multer.memoryStorage();

const upload = multer({
    storage
})
/* GET users listing. */
router.get('/', userController.getUsers);
/* Create a user */
router.post('/createUser', userController.createUser);
router.get('/getUserDetails/:UserID', userController.getUserDetails);
router.get('/userExists', userController.checkUserExists);
router.post('/generateOTP', userController.generateOTP);
router.put('/verifyOTP', userController.verifyOTP);
router.post('/login', userController.login);
router.get('/getHospitals', userController.getHospitals);
router.get('/getDoctorsByHospital', userController.getDoctorsByHospital);
router.post('/bookAppointment', userController.bookAppointment);
router.post('/changePassword', userController.changePassword);
router.post('/forgotPasswordStep1', userController.forgotPasswordStep1);
router.post('/forgotPasswordStep2', userController.forgotPasswordStep2);
router.put('/updateDeviceToken', userController.updateDeviceToken);
router.put('/updateUser', userController.updateUser);
router.post('/upload', upload.single("photo"), userController.fileUpload);




module.exports = router;
