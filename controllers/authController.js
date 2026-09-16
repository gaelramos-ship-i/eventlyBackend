const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../config/db')
const { QueryTypes } = require('sequelize')
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '24h'

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const isExistingUser = await User.isExistingUser(email)

        if(isExistingUser == 1)
            return res.status(400).json({message: 'Email is already use'})

        const isPasswordOK = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })

        if(!isPasswordOK){
            return res.status(400).json({message: 'Password must have 1 lower, 1 upper, 1 number and 1 symbol and must be at least 6 caracters long'})
        }

        const isEmailOK = validator.isEmail(email)
        if(!isEmailOK){
            return res.status(400).json({message: 'You must provide a valid email'})
        }

        await User.createUser(name, email, password)

        const user = await User.userQuery(email)
        const token = generateToken(user.id_user)
        res.status(201).json({
            message: 'User create successfully',
            token,
            user
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration', error: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ message: 'Please provide email and password' })

        const user = await User.userQuery(email)
        if(user.count == 0)
            return res.status(401).json({message: "Invalid credentials"})

        const isMatch = await bcrypt.compare(password, user.pass_user)
        if(!isMatch)
            return res.status(401).json({message: 'Invalid credentials'})

        const token = generateToken(user.id_user)

        res.status(200).json({
            message: "Login succesfully",
            token,
            user: {
                id: user.id_user,
                name: user.name_user,
                email: user.email_user
            }
        })
        
    } catch (err) {
        res.status(500).json({ message: 'Server error during login', error: err.message })
    }
}

module.exports = { register, login }