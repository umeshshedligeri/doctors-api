var express = require('express');
var router = express.Router();
let userController = require("../controllers/user/userController");
const auth = require("../middlewares/auth");

/* GET users listing. */
router.get('/', userController.getUsers);
/* Create a user */
router.post('/createUser', userController.createUser);
router.get('/getUserDetails/:UserID', userController.getUserDetails);
router.post('/generateOTP', userController.generateOTP);
router.put('/verifyOTP', userController.verifyOTP);
router.post('/login', userController.login);
router.get('/getHospitals', userController.getHospitals);
router.get('/getDoctorsByHospital', userController.getDoctorsByHospital);
router.post('/bookAppointment', userController.bookAppointment);

module.exports = router;
