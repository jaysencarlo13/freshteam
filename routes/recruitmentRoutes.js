const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { recruitment } = require('../controllers/recruitmentController');

router.post('/', authMiddleware, recruitment);

module.exports = router;
