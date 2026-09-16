const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { addEvent, updateEvent } = require('../controllers/eventController')

router.post('/add', authMiddleware, addEvent)
router.patch('/update', authMiddleware, updateEvent)

module.exports = router