const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { view, update } = require('../controllers/jobpostController');

router.post('/view', authMiddleware, view);
router.post('/update', authMiddleware, update);

module.exports = router;
