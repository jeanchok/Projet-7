const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');


router.put('/email/:id', auth, userCtrl.modifyUserEmail);
router.put('/username/:id', auth, userCtrl.modifyUsername);
router.put('/password/:id', auth, userCtrl.modifyPassword);


module.exports = router;