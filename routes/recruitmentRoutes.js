const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { recruitment, candidates } = require('../controllers/recruitmentController');

router.post('/', authMiddleware, recruitment);
router.post('/candidates', authMiddleware, candidates);

module.exports = router;
