const express = require('express');

const { body } = require ('express-validator');

const auth = require('../middleware/auth');

const router = express.Router();

const continentController = require('../controllers/continent');

router.post('/', auth, continentController.fetchAll);

module.exports = router;