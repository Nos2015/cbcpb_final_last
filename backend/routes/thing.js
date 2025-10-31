const express = require('express');

require ('express-validator');

const auth = require('../middleware/auth');

const router = express.Router();

require('../models/user');

const thingsController = require('../controllers/thing');

router.get('/', auth, thingsController.fetchAll);
router.post('/thingsallcount', thingsController.fetchCountAll);
router.post('/thingsallten', thingsController.fetchAllTen);
router.get('/thingsallgood', thingsController.fetchAllGood);
router.post('/thingsallgoodten', thingsController.fetchAllGoodTen);
router.post('/thingsallnotgoodten', thingsController.fetchAllNotGoodTen);
router.post('/thingsallequalten', thingsController.fetchAllEqualTen);
router.post('/thingsallgeneralpersonal', auth, thingsController.fetchAllGeneralPersonal);
router.post('/thingsallgeneralpersonalbypage', auth, thingsController.fetchAllTen);
router.post('/thingsallcountbyuser', auth, thingsController.fetchCountAll);
router.post('/thingwithid', thingsController.fetchThingWithId);

module.exports = router;