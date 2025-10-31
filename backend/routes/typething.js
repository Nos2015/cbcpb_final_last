const express = require('express');

require ('express-validator');

const auth = require('../middleware/auth');

const router = express.Router();

require('../models/user');

const typeThingsController = require('../controllers/typeThing');

router.post('/typesthing', typeThingsController.fetchAll);

module.exports = router;