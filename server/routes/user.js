const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const {
    googleSignUp,
    followtimelinebyuser,
} = require('../controllers/user.js');

router.post('/googleSignUp', googleSignUp);
router.post('/followtimeline', followtimelinebyuser);
// router.get('/gettimelinetags/:id', auth, gettimelinetags);

module.exports = router;
