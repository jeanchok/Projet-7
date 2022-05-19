const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const commentsCtrl = require('../controllers/comment');

// Initialize Routes for Comment
router.get('/', auth, commentsCtrl.getAllComments);
router.post('/', auth, multer, commentsCtrl.createComment);
router.get('/:id', auth, commentsCtrl.getOneComment);
router.put('/:id', auth, multer, commentsCtrl.modifyComment);
router.delete('/:id', auth, commentsCtrl.deleteComment);

module.exports = router;