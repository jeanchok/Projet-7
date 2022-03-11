const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const commentsCtrl = require('../controllers/comment');

router.get('/comment', auth, commentsCtrl.getAllComments);
router.post('/comment', auth, multer, commentsCtrl.createComment);
router.get('/:id/comment', auth, commentsCtrl.getOneComment);
router.put('/:id/comment', auth, multer, commentsCtrl.modifyComment);
router.delete('/:id/comment', auth, commentsCtrl.deleteComment);

// router.post('/:id/like', auth, postsCtrl.likeDislikeSauce);


module.exports = router;