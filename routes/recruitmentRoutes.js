const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    recruitment,
    candidates,
    fetchinfo,
    update,
    remove,
    talentpool,
    talentpool_add,
    talentpool_remove,
} = require('../controllers/recruitmentController');

router.post('/', authMiddleware, recruitment);
router.post('/candidates', authMiddleware, candidates);
router.post('/candidates/fetchinfo', authMiddleware, fetchinfo);
router.post('/candidates/update', authMiddleware, update);
router.post('/candidates/remove', authMiddleware, remove);
router.post('/talentpool', authMiddleware, talentpool);
router.post('/talentpool/add', authMiddleware, talentpool_add);
router.post('/talentpool/remove', authMiddleware, talentpool_remove);

module.exports = router;
