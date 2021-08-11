const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    fetch,
    update_personal_info,
    add_work_experience,
    update_work_experience,
    delete_work_experience,
    add_education,
    update_education,
    delete_education,
    add_skill,
    update_skill,
    delete_skill,
} = require('../controllers/applicantController');

router.post('/', authMiddleware, fetch);
router.post('/update/personal_info', authMiddleware, update_personal_info);
router.post('/add/work_experience', authMiddleware, add_work_experience);
router.post('/update/work_experience', authMiddleware, update_work_experience);
router.post('/delete/work_experience', authMiddleware, delete_work_experience);
router.post('/add/education', authMiddleware, add_education);
router.post('/update/education', authMiddleware, update_education);
router.post('/delete/education', authMiddleware, delete_education);
router.post('/add/skill', authMiddleware, add_skill);
router.post('/update/skill', authMiddleware, update_skill);
router.post('/delete/skill', authMiddleware, delete_skill);
router.post('/add/certification_licenses', authMiddleware);

module.exports = router;
