const express = require('express');
const router = express.Router();
const { postRegister, applicantRegister } = require('../controllers/registerController');

router.post('/', postRegister);
router.post('/applicant', applicantRegister);

module.exports = router;
