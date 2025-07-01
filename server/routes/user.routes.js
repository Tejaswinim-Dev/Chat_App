const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user.controller')

router.post('/register',userCtrl.register)
router.post('/login',userCtrl.login)
router.post('/setAvatar/:id', userCtrl.setAvatar);
router.get('/allUsers', userCtrl.getAllUsers);


module.exports = router;