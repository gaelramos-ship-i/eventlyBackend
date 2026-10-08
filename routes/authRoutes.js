const express = require('express')
const router = express.Router()
const validate = require('../middleware/validateMiddleware')
const { register, login } = require('../controllers/authController')
const { registerSchema, loginSchema } = require('../schemas/authSchemas')

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)

module.exports = router