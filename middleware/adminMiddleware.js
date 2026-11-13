exports.adminMiddleware = (req, res, next) => {
    if (req.user.role_user !== 'admin') {
        return res.status(403).json({
            message: 'Accès réservé aux administrateurs.'
        })
    }

    next()
}