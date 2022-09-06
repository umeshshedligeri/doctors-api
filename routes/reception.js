var express = require('express');
var router = express.Router();
let receptionController = require("../controllers/reception/receptionalistController");
const auth = require("../middlewares/auth");

router.post('/updateBookingType',receptionController.updateBookingType);

module.exports = router;
