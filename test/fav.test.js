const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
require('dotenv').config()

const Event = require('../models/eventModel')
const Favorite = require('../models/favModel')
const { addFav, deleteFav, getFav } = require('../controllers/favController')

const createMockRes = () => ({
    statusCode: 200,
    body: null,
    status(code) {
        this.statusCode = code
        return this
    },
    json(data) {
        this.body = data
        return this
    },
})

describe('Contrôleurs de favoris', () => {
    test('addFav ajoute un favori existant', async (t) => {
        t.mock.method(Event, 'getEventById', async () => [{ id_event: 25 }])
        t.mock.method(Favorite, 'isFavExist', async () => [])
        t.mock.method(Favorite, 'addFavori', async () => [1])

        const res = createMockRes()
        await addFav({
            user: { id_user: 10 },
            params: { idEvent: '25' },
        }, res)

        assert.equal(res.statusCode, 201)
        assert.match(res.body.message, /Favori create/)
    })

    test('deleteFav retire un favori existant', async (t) => {
        t.mock.method(Event, 'getEventById', async () => [{ id_event: 25 }])
        t.mock.method(Favorite, 'deleteFav', async () => [1])

        const res = createMockRes()
        await deleteFav({
            user: { id_user: 10 },
            params: { idEvent: '25' },
        }, res)

        assert.equal(res.statusCode, 200)
        assert.match(res.body.Message, /Favori deleting/)
    })

    test('getFav renvoie les favoris de l’utilisateur connecté', async (t) => {
        t.mock.method(Favorite, 'getFav', async () => [{ id_event: 25 }])

        const res = createMockRes()
        await getFav({ user: { id_user: 10 } }, res)

        assert.equal(res.statusCode, 200)
        assert.equal(res.body[0].id_event, 25)
    })
})
