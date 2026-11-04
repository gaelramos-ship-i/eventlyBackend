const { test, describe, before, after, afterEach } = require('node:test')
const assert = require('node:assert')
require('dotenv').config()

const { sequelize } = require('../config/db')

const Event = require('../models/eventModel')
const Favorite = require('../models/favModel')
const sharp = require('sharp')
const supabase = require('../config/supabase')
const {
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    getEventById,
    getEventByUser,
    updateImage,
} = require('../controllers/eventController')

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
            message: 'name, date, description, address is required'
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
        assert.strictEqual(res.body.message, 'Event created successfully')
        assert.strictEqual(typeof res.body.idEvent, 'number')
    })
})

describe('Contrôleurs d’événements', () => {
    test('addEvent crée un événement valide', async (t) => {
        t.mock.method(Event, 'isEventExist', async () => [])
        t.mock.method(Event, 'createdEvent', async () => ({ id_event: 25 }))

        const res = createMockRes()
        await addEvent({
            user: { id_user: 10 },
            body: {
                name: 'Concert de test',
                type: 'Concert',
                date: '2026-11-20',
                description: 'Description du concert',
                address: '10 rue de Paris',
            },
        }, res)

        assert.equal(res.statusCode, 201)
        assert.equal(res.body.idEvent, 25)
    })

    test('updateEvent modifie un événement appartenant à l’utilisateur', async (t) => {
        t.mock.method(Event, 'getEventById', async () => [{
            id_event: 25,
            fk_id_user: 10,
        }])
        t.mock.method(Event, 'updateEvent', async () => [1])

        const res = createMockRes()
        await updateEvent({
            user: { id_user: 10 },
            params: { idEvent: '25' },
            body: { name: 'Concert modifié' },
        }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.message, 'Updating Event successful')
    })

    test('deleteEvent supprime l’événement de son créateur', async (t) => {
        t.mock.method(Event, 'getEventById', async () => [{
            id_event: 25,
            fk_id_user: 10,
        }])
        t.mock.method(Favorite, 'deleteFav', async () => [])
        t.mock.method(Event, 'deleteEvent', async () => 1)

        const res = createMockRes()
        await deleteEvent({
            user: { id_user: 10 },
            params: { idEvent: '25' },
        }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.message, 'Deleting Event successful')
    })

    test('getEvent renvoie la liste des événements', async (t) => {
        t.mock.method(Event, 'getEvent', async () => [{ id_event: 25 }])

        const res = createMockRes()
        await getEvent({}, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.getEvent.length, 1)
        assert.equal(res.body.getEvent[0].id_event, 25)
    })

    test('getEventById renvoie l’événement demandé', async (t) => {
        t.mock.method(Event, 'getEventById', async () => [{ id_event: 25 }])

        const res = createMockRes()
        await getEventById({ params: { idEvent: '25' } }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.getEventById[0].id_event, 25)
    })

    test('getEventByUser renvoie les événements de l’utilisateur connecté', async (t) => {
        t.mock.method(Event, 'getByUser', async () => [{ id_event: 25 }])

        const res = createMockRes()
        await getEventByUser({ user: { id_user: 10 } }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.eventUser[0].id_event, 25)
    })

    test('updateImage traite et stocke une image pour le créateur', async (t) => {
        t.mock.method(Event, 'getEventById', async () => [{
            id_event: 25,
            fk_id_user: 10,
        }])
        t.mock.method(Event, 'updateImage', async () => [1])
        const storage = {
            upload: async (path, buffer, options) => {
                assert.match(path, /^events\/.+\.webp$/)
                assert.ok(Buffer.isBuffer(buffer))
                assert.equal(options.contentType, 'image/webp')
                return { error: null }
            },
            getPublicUrl: () => ({
                data: { publicUrl: 'https://storage.example/event.webp' },
            }),
        }
        t.mock.method(supabase.storage, 'from', () => storage)
        const previousBucket = process.env.SUPABASE_BUCKET
        process.env.SUPABASE_BUCKET = 'evently-test'
        t.after(() => {
            if (previousBucket === undefined) delete process.env.SUPABASE_BUCKET
            else process.env.SUPABASE_BUCKET = previousBucket
        })
        const image = await sharp({
            create: {
                width: 1,
                height: 1,
                channels: 3,
                background: { r: 20, g: 40, b: 60 },
            },
        }).png().toBuffer()

        const res = createMockRes()
        await updateImage({
            user: { id_user: 10 },
            params: { idEvent: '25' },
            file: { buffer: image },
        }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body.image, 'https://storage.example/event.webp')
        assert.equal(Event.updateImage.mock.calls.length, 1)
    })
})


