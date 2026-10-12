const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const multerMiddleware = require('../middleware/multerMiddleware')
const { addEvent, updateEvent, deleteEvent, getEvent, getEventById, updateImage, getEventByUser } = require('../controllers/eventController')

router.post('/add', authMiddleware, addEvent)
router.patch('/:idEvent', authMiddleware, updateEvent)
router.delete('/:idEvent', authMiddleware, deleteEvent)
router.get('/user', authMiddleware, getEventByUser)
router.get('/:idEvent', getEventById)
router.get('/', getEvent)

router.patch("/:idEvent/image", authMiddleware, multerMiddleware, updateImage)

module.exports = router