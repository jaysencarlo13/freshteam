const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { reports } = require('../controllers/reportsController');

router.post('/', authMiddleware, reports);

module.exports = router;
