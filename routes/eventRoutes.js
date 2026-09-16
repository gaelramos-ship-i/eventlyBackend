const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { addEvent } = require('../controllers/eventController')

router.post('/add', authMiddleware, addEvent)

module.exports = router