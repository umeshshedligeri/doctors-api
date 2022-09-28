var express = require('express');
var router = express.Router();
let receptionController = require("../controllers/reception/receptionalistController");
const auth = require("../middlewares/auth");

router.post('/updateBookingType',receptionController.updateBookingType);
router.post('/setDoctorActivity',receptionController.setDoctorActivity);

module.exports = router;
