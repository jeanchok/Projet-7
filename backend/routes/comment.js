const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const commentsCtrl = require('../controllers/comment');

router.get('/', auth, commentsCtrl.getAllComments);
router.post('/', auth, multer, commentsCtrl.createComment);
router.get('/:id', auth, commentsCtrl.getOneComment);
router.put('/:id', auth, multer, commentsCtrl.modifyComment);
router.delete('/:id', auth, commentsCtrl.deleteComment);

// router.post('/:id/like', auth, postsCtrl.likeDislikeSauce);


module.exports = router;