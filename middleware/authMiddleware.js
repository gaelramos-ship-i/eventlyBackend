const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET

exports.authMiddleware = async (req, res, next) => {
    try {
        let token
        if(req.headers.authorization?.startsWith('Bearer'))
            token = req.headers.authorization.split(' ')[1]
        if (!token) 
            return res.status(401).json({message: "Not authorized, token missing"})
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.getUserById(decoded.id)
        if(!user)
            return res.status(401).json({message: "User no longer exists"})
        req.user = user[0]
        next()
    } catch (err) {
        return res.status(401).json({message: 'Not authorized invalid token', error: err.message})
    }
}