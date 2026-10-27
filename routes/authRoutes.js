const express = require('express')
const router = express.Router()
const validate = require('../middleware/validateMiddleware')
const { authMiddleware } = require('../middleware/authMiddleware')
const { register, login, getUser, forgotPassword, resetPassword, updateUser } = require('../controllers/authController')
const { registerSchema, loginSchema } = require('../schemas/authSchemas')

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/user', authMiddleware, getUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.put('/update-profil', authMiddleware, updateUser)

module.exports = router