const express = require('express');
const router = express.Router();

const {
    createTimeline,
    getTimelineList,
    getTimelineInfo,
    followtimelinebyuser,
    unfollowtimelinebyuser,
    listpersonalimp,
    followtimelinefromtimeline,
} = require('../controllers/timeline.js');
const auth = require('../middleware/auth.js');

router.post('/createtimeline', auth, createTimeline);
router.get('/gettimelinelist/:keyword', auth, getTimelineList);
router.get('/gettimelineinfo/:id', auth, getTimelineInfo);
router.post('/followtimelinebyuser/:id', auth, followtimelinebyuser);
router.post('/unfollowtimelinebyuser/:id', auth, unfollowtimelinebyuser);
router.get('/listpersonalimp', auth, listpersonalimp);
router.post('/followtimelinefromtimeline', auth, followtimelinefromtimeline);
module.exports = router;
