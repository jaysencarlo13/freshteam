const express = require('express');
const router = express.Router();
const { postLogin, applicantLogin } = require('../controllers/loginController');

router.post('/', postLogin);
router.post('/applicant', applicantLogin);

module.exports = router;
