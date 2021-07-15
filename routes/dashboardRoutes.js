const express = require('express');
const router = express.Router();
const { getDashboard, getUser, getLogout, updateUser, changepassword } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getDashboard);
router.post('/user', authMiddleware, getUser);
router.post('/userupdate', authMiddleware, updateUser);
router.post('/changepassword', authMiddleware, changepassword);
router.post('/logout', authMiddleware, getLogout);

module.exports = router;
