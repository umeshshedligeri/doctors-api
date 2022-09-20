var express = require('express');
var router = express.Router();
let paymentController = require("../controllers/payment/payment");
const auth = require("../middlewares/auth");


router.post('/paynow', paymentController.paynow);
router.post('/callback', paymentController.paymentCallback);


module.exports = router;