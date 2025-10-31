const express = require('express');

require ('express-validator');

const auth = require('../middleware/auth');

const router = express.Router();

const votesController = require('../controllers/votething');

router.post('/checkvotes', auth, votesController.fetchVoteExist);
router.post('/votesusers', auth, votesController.fetchVotesUsers);
router.post('/votethings', auth, votesController.fetchVoteThings);
router.post('/updatething', auth, votesController.fetchVoteUpdateThing);

module.exports = router;