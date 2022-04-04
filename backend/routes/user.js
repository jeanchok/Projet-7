const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
//router.put('/:id', userCtrl.modifyUser);
router.put('/email/:id', auth, userCtrl.modifyUserEmail);
// router.put('/username/:id', auth, userCtrl.modifyUsername);
// router.put('/password/:id', auth, userCtrl.modifyPassword);
router.get('/:id', userCtrl.getUser);
router.get('/', auth, userCtrl.getAllUsers);

router.post('/login', userCtrl.login);
router.delete('/delete/:id', auth, userCtrl.deleteUser);

module.exports = router;