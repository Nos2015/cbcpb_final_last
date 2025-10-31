const express = require('express');

require ('express-validator');

const auth = require('../middleware/auth');

const router = express.Router();

require('../models/user');

const authController = require('../controllers/auth');

router.post('/signup',authController.signup);

router.post('/login', authController.login);

router.post('/update', authController.update);

router.post('/checkuserinfos', auth, authController.checkuserinfos);

router.post('/isadmin', authController.admin);

router.post('/checkcode', authController.checkcode);

router.post('/changeCodeActivation', authController.changeCodeActivation);

router.post('/validateUser', authController.validateUser);

router.post('/sendmailcode', authController.sendmailcode);

//router.post('/searchsameuser',authController.searchsameuser);

module.exports = router;