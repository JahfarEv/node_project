const express = require('express');
const authController = require('../../Apis/controllers/authController')

const router = express.Router();

router.route('/signup').post(authController.signup);

module.exports = router;