const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const inboxMiddleware = require('../middleware/inboxMiddleware');
const { inbox, check, reply, send, search } = require('../controllers/inboxController');

router.post('/', authMiddleware, inboxMiddleware, inbox);
router.post('/check', authMiddleware, check);
router.post('/reply', authMiddleware, reply);
router.post('/send', authMiddleware, send);
router.post('/search', authMiddleware, search);

module.exports = router;
