const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { adminMiddleware } = require('../middleware/adminMiddleware')
const { getPendingEvents, moderateEvent } = require('../controllers/adminController')

router.get('/pending', authMiddleware, adminMiddleware, getPendingEvents)
router.patch('/:idEvent/status', authMiddleware, adminMiddleware, moderateEvent)