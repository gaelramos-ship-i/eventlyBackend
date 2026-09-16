const { test, describe, before, after, afterEach } = require('node:test')
const assert = require('node:assert')
require('dotenv').config()

const { sequelize } = require('../config/db')

const { addEvent } = require('../controllers/eventController')

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

describe('US4: share an event with a title, date, description, address, category, and price', () => {

    before(async () => {
        await sequelize.authenticate()
    })

    afterEach(async () => {
        await sequelize.query(`DELETE FROM "Events" WHERE fk_id_user = :userId AND name_event = :name AND date_event = :date`, {
            replacements: {
                userId: 1,
                name: 'Concert de test',
                date: '2026-10-15'
            }
        })
    })

    after(async () => {
        await sequelize.close()
    })

    test('should return 400 when name is missing', async () => {
        const req = {
            user: {
                id_user: 1
            },
            body: {
                date: '2026-10-15',
                description: 'Concert de test',
                address: '10 rue de Paris',
                type: 'concert',
                price: 25
            }
        }

        const res = createMockRes()

        await addEvent(req, res)

        assert.strictEqual(res.statusCode, 400)
        assert.deepStrictEqual(res.body, {
            message: 'name, date, description, address, type is required'
        })
    })

    test('should return 409 if event is already created', async () => {
        const req = {
            user: {
                id_user: 1
            },
            body: {
                name: 'Concert de test',
                date: '2026-10-15',
                description: 'Concert de test',
                address: '10 rue de Paris',
                type: 'concert',
                price: 25
            }
        }

        const res1 = createMockRes()
        await addEvent(req, res1)
        assert.strictEqual(res1.statusCode, 201)

        const res2 = createMockRes()
        await addEvent(req, res2)
        assert.strictEqual(res2.statusCode, 409)

        assert.deepStrictEqual(res2.body, { message: 'This event is already created'})
    })

    test('should return 201 if event created successfully', async () => {
        const req = {
            user: {
                id_user: 1
            },
            body: {
                name: 'Concert de test',
                date: '2026-10-15',
                description: 'Concert de test',
                address: '10 rue de Paris',
                type: 'concert',
                price: 25
            }
        }

        const res = createMockRes()

        await addEvent(req, res)

        assert.strictEqual(res.statusCode, 201)
        assert.deepStrictEqual(res.body, { message: 'Event created successfully' })
    })
})