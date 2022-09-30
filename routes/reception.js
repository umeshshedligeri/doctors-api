var express = require('express');
var router = express.Router();
let receptionController = require("../controllers/reception/receptionalistController");
const auth = require("../middlewares/auth");

router.post('/updateBookingType',receptionController.updateBookingType);
router.post('/setDoctorActivity',receptionController.setDoctorActivity);
router.get('/getDoctorActivity',receptionController.getDoctorActivity);
router.post('/updateTokenQueue',receptionController.updateTokenQueue);
router.get('/getTokenQueue',receptionController.getTokenQueue);

module.exports = router;
