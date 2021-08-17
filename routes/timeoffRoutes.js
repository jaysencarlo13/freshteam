const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { timeoff, request, timeoff_employees, accept, reject } = require('../controllers/timeoffController');

router.post('/', authMiddleware, timeoff);
router.post('/request', authMiddleware, request);
router.post('/employees', authMiddleware, timeoff_employees);
router.post('/accept', authMiddleware, accept);
router.post('/reject', authMiddleware, reject);

module.exports = router;
