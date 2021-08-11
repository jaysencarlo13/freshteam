const express = require('express');
const router = express.Router();
const { settings, update } = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, settings);
router.post('/update', authMiddleware, update);

module.exports = router;
