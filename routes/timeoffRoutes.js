const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { timeoff, request } = require('../controllers/timeoffController');

router.post('/', authMiddleware, timeoff);
router.post('/request', authMiddleware, request);

module.exports = router;
