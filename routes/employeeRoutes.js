const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    employees,
    onboarding,
    offboarding,
    offboarding_accept,
    offboarding_reject,
    offboarding_request,
    employee_update,
} = require('../controllers/employeeController');

router.post('/', authMiddleware, employees);
router.post('/update', authMiddleware, employee_update);
router.post('/onboarding', authMiddleware, onboarding);
router.post('/offboarding', authMiddleware, offboarding);
router.post('/offboarding/accept', authMiddleware, offboarding_accept);
router.post('/offboarding/reject', authMiddleware, offboarding_reject);
router.post('/offboarding/request', authMiddleware, offboarding_request);

module.exports = router;
