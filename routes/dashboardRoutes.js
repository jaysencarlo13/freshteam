const express = require('express');
const router = express.Router();
const {
    getDashboard,
    getUser,
    getLogout,
    updateUser,
    changepassword,
    checkAuth,
    getMyInterviews,
    updateGoogle,
    transfer,
    admin_request,
    superuser,
    superuser_accept,
    superuser_reject,
    admin_fresh,
    organization_details,
    organization_update,
    send_feedback,
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getDashboard);
router.post('/checkAuth', authMiddleware, checkAuth);
router.post('/user', authMiddleware, getUser);
router.post('/userupdate', authMiddleware, updateUser);
router.post('/changepassword', authMiddleware, changepassword);
router.post('/fetchdashboard', authMiddleware, getMyInterviews);
router.post('/user/update/google', authMiddleware, updateGoogle);
router.post('/user/transfer/applicant', authMiddleware, transfer);
router.post('/user/admin_request', authMiddleware, admin_request);
router.post('/superuser', authMiddleware, superuser);
router.post('/superuser/accept', authMiddleware, superuser_accept);
router.post('/superuser/reject', authMiddleware, superuser_reject);
router.post('/admin_fresh', authMiddleware, admin_fresh);
router.post('/organization', authMiddleware, organization_details);
router.post('/organization/update', authMiddleware, organization_update);
router.post('/interview/feedback', authMiddleware, send_feedback);
router.post('/logout', authMiddleware, getLogout);

module.exports = router;
