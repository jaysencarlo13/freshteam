const express = require('express');
const router = express.Router();
const {
  add_department,
  add_employee,
  add_job_posting,
} = require('../controllers/addController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/department', authMiddleware, add_department);
router.post('/employee', authMiddleware, add_employee);
router.post('/job_posting', authMiddleware, add_job_posting);

module.exports = router;
