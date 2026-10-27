const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const { createHash, randomBytes } = require('crypto')
const transporter = require('../config/mailer')

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

        if (isExistingUser == 1)
            return res.status(409).json({
                title: "Vous ne pouvez pas vous inscrire avec ce mail",
                status: 409,
                detail: "Ce mail ne peut pas être utilisé"
            })

        // const isPasswordOK = validator.isStrongPassword(password, {
        //     minLength: 6,
        //     minLowercase: 1,
        //     minUppercase: 1,
        //     minNumbers: 1,
        //     minSymbols: 1
        // })

        // if(!isPasswordOK){
        //     return res.status(400).json({message: 'Password must have 1 lower, 1 upper, 1 number and 1 symbol and must be at least 6 caracters long'})
        // }

        // const isEmailOK = validator.isEmail(email)
        // if(!isEmailOK){
        //     return res.status(400).json({message: 'You must provide a valid email'})
        // }

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

        // if (!email || !password)
        //     return res.status(400).json({ message: 'Please provide email and password' })

        const user = await User.userQuery(email)
        if (user.count == 0)
            return res.status(401).json({
                title: "Identifiants incorrects",
                status: 401,
                detail: "Les identifiants ne sont pas corrects"
            })

        const isMatch = await bcrypt.compare(password, user.pass_user)
        if (!isMatch)
            return res.status(401).json({
                title: "Identifiants incorrects",
                status: 401,
                detail: "Les identifiants ne sont pas corrects"
            })

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
        console.error(err)
        res.status(500).json({ message: 'Server error during login', error: err.message })
    }
}

const getUser = async (req, res) => {
    try {
        const idUser = req.user.id_user
        const user = await User.getUserById(idUser)
        const name = user[0].name_user
        const email = user[0].email_user
        if (user)
            return res.status(200).json({
                name,
                email,
                message: "Reading user successfull"
            })
        return res.status(200).json({ message: "Aucun utilisateur" })
    } catch (err) {
        return res.status(500).json({ message: "Error view user" });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (typeof email !== 'string' ||
            !validator.isEmail(email.trim())) {
            return res.status(400).json({
                message: "Veuillez saisir une adresse email valide."
            })
        }

        const user = await User.userQuery(email.trim())

        // Même réponse que l'adresse existe ou non.
        if (!user) {
            return res.status(200).json({
                message: "Si un compte correspond à cette adresse, tu recevras un email."
            })
        }

        const token = randomBytes(32).toString('hex')
        const tokenHash = createHash('sha256')
            .update(token)
            .digest('hex')

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        await User.createPasswordResetToken(
            user.id_user,
            tokenHash,
            expiresAt
        )

        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password?token=${token}`

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email_user,
            subject: 'Réinitialisation du mot de passe Evently',
            text: `Pour choisir un nouveau mot de passe, ouvre ce lien : ${resetLink}`,
            html: `
                <h2>Réinitialisation du mot de passe</h2>
                <p>Ce lien expire dans 15 minutes.</p>
                <a href="${resetLink}">Choisir un nouveau mot de passe</a>
            `
        })

        return res.status(200).json({
            message: "Si un compte correspond à cette adresse, tu recevras un email."
        })
    } catch (err) {
        console.error('Erreur forgotPassword :', err.message)

        return res.status(500).json({
            message: "Une erreur est survenue. Réessaie plus tard."
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        if (typeof token !== 'string' || token.length !== 64 ||
            typeof password !== 'string' ||
            password.length < 8 || password.length > 72) {
            return res.status(400).json({
                message: "Lien invalide ou mot de passe non valide (8 caractères minimum)."
            })
        }

        const tokenHash = createHash('sha256')
            .update(token)
            .digest('hex')

        const resetToken =
            await User.getValidPasswordResetToken(tokenHash)

        if (!resetToken) {
            return res.status(400).json({
                message: "Ce lien est invalide ou a expiré."
            })
        }

        await User.resetUserPassword(
            resetToken.id,
            resetToken.id_user,
            password
        )

        return res.status(200).json({
            message: "Ton mot de passe a été modifié avec succès."
        })
    } catch (err) {
        if (err.message === 'RESET_TOKEN_INVALID') {
            return res.status(400).json({
                message: "Ce lien est invalide ou a expiré."
            })
        }

        console.error('Erreur resetPassword :', err.message)

        return res.status(500).json({
            message: "Une erreur est survenue."
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const idUser = req.user.id_user;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Le nom et l'email sont obligatoires."
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Veuillez saisir une adresse email valide."
            });
        }

        await User.updateUser(idUser, name, email);

        return res.status(200).json({
            message: "Profil modifié avec succès.",
            user: {
                id: idUser,
                name,
                email
            }
        });
    } catch (err) {
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Cette adresse email est déjà utilisée."
            });
        }

        return res.status(500).json({
            message: "Erreur lors de la modification du profil."
        });
    }
};

module.exports = { register, login, getUser, forgotPassword, resetPassword, updateUser }