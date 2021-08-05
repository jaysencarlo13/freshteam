const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { view, update, fetchJobPost, fetchById } = require('../controllers/jobpostController');

router.post('/view', authMiddleware, view);
router.post('/update', authMiddleware, update);
router.get('/fetch', fetchJobPost);
router.get('/fetchById', fetchById);

module.exports = router;
