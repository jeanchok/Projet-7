const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postsCtrl = require('../controllers/post');

// Initialize Routes for Post
router.get('/', auth, postsCtrl.getAllPosts);
router.post('/', auth, multer, postsCtrl.createPost);
router.get('/:id', auth, postsCtrl.getOnePost);
router.put('/:id', auth, multer, postsCtrl.modifyPost);
router.delete('/:id', auth, postsCtrl.deletePost);

router.post('/:id/like', auth, postsCtrl.likePost);


module.exports = router;