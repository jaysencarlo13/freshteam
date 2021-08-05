const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { fetch } = require('../controllers/applicantController');

router.post('/', authMiddleware, fetch);
router.post('/', authMiddleware);

module.exports = router;
