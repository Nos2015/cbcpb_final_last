const express = require('express');

const { body } = require ('express-validator');

const auth = require('../middleware/auth');

const router = express.Router();

const countryController = require('../controllers/countryUser');

router.post('/countryUser', auth, countryController.getCountryUser);

module.exports = router;