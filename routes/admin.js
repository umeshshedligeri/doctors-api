var express = require('express');
var router = express.Router();
let adminController = require("../controllers/admin/adminController");
const auth = require("../middlewares/auth");


router.post('/createHospital', adminController.createHospital);
router.post('/addDoctor', adminController.addDoctors);


module.exports = router;
