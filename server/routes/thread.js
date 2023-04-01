const express = require('express');
const router = express.Router();

const { joinThread, sendMessage } = require('../controllers/thread.js');

router.post('/join', joinThread);
router.post('/sendMessage', sendMessage);

module.exports = router;
