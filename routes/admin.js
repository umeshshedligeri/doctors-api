var express = require('express');
var router = express.Router();
let adminController = require("../controllers/admin/adminController");
const auth = require("../middlewares/auth");


router.post('/createHospital', auth, adminController.createHospital);
router.post('/addDoctor', auth, adminController.addDoctors);


module.exports = router;
