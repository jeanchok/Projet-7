const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config');
const password = require("../middleware/password");

router.post('/signup', password, userCtrl.signup);
router.put('/email/:id', auth, userCtrl.modifyUserEmail);
router.put('/avatar/:id', auth, multer, userCtrl.modifyUserAvatar);
router.put('/username/:id', auth, userCtrl.modifyUsername);
router.put('/password/:id', auth, userCtrl.modifyUserPassword);
router.get('/:id', auth, userCtrl.getUser);
router.get('/', auth, userCtrl.getAllUsers);

router.post('/login', userCtrl.login);
router.delete('/delete/:id', auth, userCtrl.deleteUser);

module.exports = router;