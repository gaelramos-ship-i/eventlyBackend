const express = require('express')
const router = express.Router()
const validate = require('../middleware/validateMiddleware')
const { authMiddleware } = require('../middleware/authMiddleware')
const { register, login, getUser } = require('../controllers/authController')
const { registerSchema, loginSchema } = require('../schemas/authSchemas')

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/user', authMiddleware, getUser)

module.exports = router