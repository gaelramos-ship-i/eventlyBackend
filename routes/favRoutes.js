const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { addFav, deleteFav } = require('../controllers/favController')

router.post('/:idEvent', authMiddleware, addFav)
router.delete('/:idEvent', authMiddleware, deleteFav)

module.exports = router