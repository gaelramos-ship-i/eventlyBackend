const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { addFav, deleteFav, getFav } = require('../controllers/favController')

router.post('/:idEvent', authMiddleware, addFav)
router.delete('/:idEvent', authMiddleware, deleteFav)
router.get('/get', authMiddleware, getFav)

module.exports = router