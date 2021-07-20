const express = require('express');
const router = express.Router();
const {
  add_department,
  add_employee,
} = require('../controllers/addController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/department', authMiddleware, add_department);
router.post('/employee', authMiddleware, add_employee);

module.exports = router;
