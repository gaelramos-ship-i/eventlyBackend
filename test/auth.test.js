const { test, describe, before, after } = require('node:test')
const assert = require('node:assert')
require('dotenv').config()

const { sequelize } = require('../config/db')

const {
    register,
    login,
    getUser,
    forgotPassword,
    resetPassword,
    updateUser,
} = require('../controllers/authController')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const transporter = require('../config/mailer')
const { registerSchema, loginSchema } = require('../schemas/authSchemas')

const createMockRes = () => {
    const res = {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code
            return this
        },
        json(data) {
            this.body = data
            return this
        }
    }
    return res
}

describe('Test unitaire', () => {

    const testEmails = ['test_us_a@example.com', 'test_us_b@example.com']

    before(async () => {
        await sequelize.authenticate()
        await sequelize.query(
            'DELETE FROM "Users" WHERE "email_user" IN (:emails)',
            { replacements: { emails: testEmails } }
        )
    })

    after(async () => {
        await sequelize.query(
            'DELETE FROM "Users" WHERE "email_user" IN (:emails)',
            { replacements: { emails: testEmails } }
        )
        await sequelize.close()
    })

    test('US1: Register user with email, name, strong password', async () => {
        const reqA = {
            body: {
                name: 'Alice Tester',
                email: 'test_us_a@example.com',
                password: 'Password123!'
            }
        }
        const resA = createMockRes()
        await register(reqA, resA)
        assert.strictEqual(resA.statusCode, 201)
        assert.ok(resA.body.token)

        // Register user B
        const reqB = {
            body: {
                name: 'Bob Collaborator',
                email: 'test_us_b@example.com',
                password: 'Password123!'
            }
        }
        const resB = createMockRes()
        await register(reqB, resB)
        assert.strictEqual(resB.statusCode, 201)

        // Duplicate email check
        const resDup = createMockRes()
        await register(reqA, resDup)
        assert.strictEqual(resDup.statusCode, 409)
    })

    test('US2: Login user to get secure token', async () => {
        const req = {
            body: {
                email: 'test_us_a@example.com',
                password: 'Password123!'
            }
        }
        const res = createMockRes()
        await login(req, res)
        assert.strictEqual(res.statusCode, 200)
        assert.ok(res.body.token)
    })

    test('US1: reject invalid registration data', () => {
        const invalidEmail = registerSchema.safeParse({
            name: 'Alice Tester',
            email: 'adresse-invalide',
            password: 'Password123!'
        })
        assert.strictEqual(invalidEmail.success, false)

        const weakPassword = registerSchema.safeParse({
            name: 'Alice Tester',
            email: 'alice@example.com',
            password: 'password'
        })
        assert.strictEqual(weakPassword.success, false)

        const missingName = registerSchema.safeParse({
            email: 'alice@example.com',
            password: 'Password123!'
        })
        assert.strictEqual(missingName.success, false)
    })

    test('US2: reject invalid login data', () => {
        const invalidLogin = loginSchema.safeParse({
            email: 'adresse-invalide',
            password: 'Password123!'
        })
        assert.strictEqual(invalidLogin.success, false)

        const missingPassword = loginSchema.safeParse({
            email: 'alice@example.com'
        })
        assert.strictEqual(missingPassword.success, false)
    })

    test('US2: reject login with an incorrect password', async () => {
        const req = {
            body: {
                email: 'test_us_a@example.com',
                password: 'WrongPassword123!'
            }
        }
        const res = createMockRes()
        await login(req, res)

        assert.strictEqual(res.statusCode, 401)
        assert.strictEqual(res.body.title, 'Identifiants incorrects')
    })
})

describe('Contrôleurs d’authentification', () => {
    test('register crée un compte et renvoie un token', async (t) => {
        t.mock.method(User, 'isExistingUser', async () => 0)
        t.mock.method(User, 'createUser', async () => {})
        t.mock.method(User, 'userQuery', async () => ({
            id_user: 10,
            name_user: 'Alice Test',
            email_user: 'alice.test@example.com',
        }))

        const res = createMockRes()
        await register({
            body: {
                name: 'Alice Test',
                email: 'alice.test@example.com',
                password: 'Password123!',
            },
        }, res)

        assert.equal(res.statusCode, 201)
        assert.equal(res.body.user.id_user, 10)
        assert.ok(res.body.token)
    })

    test('login accepte les identifiants valides et renvoie un token', async (t) => {
        const passwordHash = await bcrypt.hash('Password123!', 4)
        t.mock.method(User, 'userQuery', async () => ({
            id_user: 10,
            name_user: 'Alice Test',
            email_user: 'alice.test@example.com',
            pass_user: passwordHash,
        }))

        const res = createMockRes()
        await login({
            body: { email: 'alice.test@example.com', password: 'Password123!' },
        }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.user.id, 10)
        assert.ok(res.body.token)
    })

    test('getUser renvoie le profil de l’utilisateur connecté', async (t) => {
        t.mock.method(User, 'getUserById', async () => [{
            id_user: 10,
            name_user: 'Alice Test',
            email_user: 'alice.test@example.com',
        }])

        const res = createMockRes()
        await getUser({ user: { id_user: 10 } }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.name, 'Alice Test')
        assert.equal(res.body.email, 'alice.test@example.com')
    })

    test('forgotPassword crée un jeton et envoie le courriel', async (t) => {
        const previousFrontendUrl = process.env.FRONTEND_URL
        const previousEmailUser = process.env.EMAIL_USER
        process.env.FRONTEND_URL = 'https://evently.example'
        process.env.EMAIL_USER = 'noreply@evently.example'
        t.after(() => {
            if (previousFrontendUrl === undefined) delete process.env.FRONTEND_URL
            else process.env.FRONTEND_URL = previousFrontendUrl
            if (previousEmailUser === undefined) delete process.env.EMAIL_USER
            else process.env.EMAIL_USER = previousEmailUser
        })

        t.mock.method(User, 'userQuery', async () => ({
            id_user: 10,
            email_user: 'alice.test@example.com',
        }))
        t.mock.method(User, 'createPasswordResetToken', async () => {})
        t.mock.method(transporter, 'sendMail', async () => ({ messageId: 'test' }))

        const res = createMockRes()
        await forgotPassword({ body: { email: 'alice.test@example.com' } }, res)

        assert.equal(res.statusCode, 200)
        assert.match(res.body.message, /tu recevras un email/)
        assert.equal(User.createPasswordResetToken.mock.calls.length, 1)
        assert.equal(transporter.sendMail.mock.calls.length, 1)
    })

    test('resetPassword consomme un jeton valide et modifie le mot de passe', async (t) => {
        t.mock.method(User, 'getValidPasswordResetToken', async () => ({
            id: 5,
            id_user: 10,
        }))
        t.mock.method(User, 'resetUserPassword', async () => {})

        const res = createMockRes()
        await resetPassword({
            body: { token: 'a'.repeat(64), password: 'NewPassword123!' },
        }, res)

        assert.equal(res.statusCode, 200)
        assert.match(res.body.message, /modifié avec succès/)
        assert.equal(User.resetUserPassword.mock.calls.length, 1)
    })

    test('updateUser met à jour le profil avec des données valides', async (t) => {
        t.mock.method(User, 'updateUser', async () => {})

        const res = createMockRes()
        await updateUser({
            user: { id_user: 10 },
            body: { name: 'Alice Mise à jour', email: 'alice.new@example.com' },
        }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.user.name, 'Alice Mise à jour')
        assert.equal(res.body.user.email, 'alice.new@example.com')
    })
})


