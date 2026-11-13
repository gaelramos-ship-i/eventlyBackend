const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { adminMiddleware } = require('../middleware/adminMiddleware')
const { getPendingEvents, moderateEvent, getUsers, updateUserRole, removeUser } = require('../controllers/adminController')

router.get('/pending', authMiddleware, adminMiddleware, getPendingEvents)
router.patch('/:idEvent/status', authMiddleware, adminMiddleware, moderateEvent)
router.get('/users', authMiddleware, adminMiddleware, getUsers)
router.patch('/users/:id/role', authMiddleware, adminMiddleware, updateUserRole)
router.delete('/users/:id', authMiddleware, adminMiddleware, removeUser)

module.exports = router