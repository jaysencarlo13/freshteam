const express = require('express');
const router = express.Router();
const { postRegister } = require('../controllers/registerController');

router.post('/', postRegister);

module.exports = router;
