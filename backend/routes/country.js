const express = require('express');

require ('express-validator');

const auth = require('../middleware/auth');

const router = express.Router();

require('../models/user');

const countryController = require('../controllers/country');

router.post('/', countryController.fetchAll);

router.get('/getcountry', countryController.getCountryUser);

module.exports = router;