const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { addEvent, updateEvent, deleteEvent, getAllEvent } = require('../controllers/eventController')

router.post('/add', authMiddleware, addEvent)
router.patch('/:idEvent', authMiddleware, updateEvent)
router.delete('/:idEvent', authMiddleware, deleteEvent)
router.get('/', getAllEvent)

module.exports = router