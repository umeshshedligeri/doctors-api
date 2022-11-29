var express = require('express');
var router = express.Router();
let adminController = require("../controllers/admin/adminController");
const auth = require("../middlewares/auth");


router.post('/createHospital', adminController.createHospital);
router.post('/addDoctor', adminController.addDoctors);
router.get('/getDoctorInfo/:doctorId', adminController.getDoctorInfo);
router.put('/updateDoctorInfo', adminController.updateDoctorInfo);
router.put('/updateHospitalInfo', adminController.updateHospitalInfo);
router.get('/getHospitalInfo/:HospitalID', adminController.getHospitalInfo);
router.post('/addReceptionalist', adminController.addReceptionalist);
router.put('/updateReceptionalist', adminController.updateReceptionalist);
router.get('/getReceptionalists', adminController.getReceptionalists);


module.exports = router;
