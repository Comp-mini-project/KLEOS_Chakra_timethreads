const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const {
    createmyEvent,
    editmyEvent,
    deletemyEvent,
    getmyEvents,
    getEventdetailsById,
    createEventfortimeline,
    editEventfortimeline,
    deleteEventfortimeline,
} = require('../controllers/event.js');

router.post('/createmyEvent', auth, createmyEvent);
router.post('/editmyEvent/:id', auth, editmyEvent); //id of event
router.delete('/deletemyEvent/:id', auth, deletemyEvent); //id of event
router.get('/getmyEvents', auth, getmyEvents);
router.get('/getEventdetailsById/:id', auth, getEventdetailsById); //id of event
router.post('/createEventfortimeline/:id', auth, createEventfortimeline); //id is timeline id
router.post('/editEventfortimeline/:id', auth, editEventfortimeline); //id is event id
router.post('deleteEventfortimeline/:id', auth, deleteEventfortimeline); //id is event id
module.exports = router;
