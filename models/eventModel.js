const { sequelize } = require('../config/db')
const { QueryTypes } = require('sequelize')

exports.isEventExist = async (userId, name, date) => {
    const existingEvent = await sequelize.query(`SELECT id_event FROM "Events" WHERE fk_id_user = :userId AND name_event = :name AND date_event = :date LIMIT 1`, {
        type: QueryTypes.SELECT,
        replacements: {
            userId,
            name,
            date
        }
    })
    return existingEvent
}

exports.createdEvent = async (name, type, date, description, address, userId) => {
    const result = await sequelize.query(`INSERT INTO "Events"(name_event, type_event, date_event, address_event, description_event, fk_id_user) VALUES(:name, :type, :date, :address, :description, :userId) RETURNING id_event`, {
        type: QueryTypes.INSERT,
        replacements: {
            name,
            type,
            date,
            address,
            description,
            userId,
        }
    })
    return result[0][0]
}

exports.getEventById = async (idEvent) => {
    const eventExist = await sequelize.query('SELECT * FROM "Events" WHERE id_event = :idEvent', {
        type: QueryTypes.SELECT,
        replacements: {
            idEvent
        }
    })
    return eventExist
}

exports.getByUser = async (idUser) => {
    const eventUser = await sequelize.query('SELECT * FROM "Events" WHERE fk_id_user = :idUser', {
        type: QueryTypes.SELECT,
        replacements: {
            idUser
        }
    })
    return eventUser
}

exports.updateEvent = async (fields, replacements) => {
    const updateEvent = await sequelize.query(`UPDATE "Events" SET ${fields.join(', ')} WHERE id_event = :idEvent`, {
        type: QueryTypes.UPDATE,
        replacements
    })
    return updateEvent
}

exports.deleteEvent = async (idEvent) => {
    const deleteEvent = await sequelize.query('DELETE FROM "Events" WHERE id_event = :idEvent', {
        type: QueryTypes.DELETE,
        replacements: {
            idEvent
        }
    })
    return deleteEvent
}

exports.getEvent = async (keyword) => {
    const event = await sequelize.query(`SELECT * FROM "Events"`, {
        type: QueryTypes.SELECT
    })
    return event
}

exports.updateImage = async (idEvent, image) => {
    const update = await sequelize.query(`UPDATE "Events" SET image_event = :image WHERE id_event = :idEvent`, {
        type: QueryTypes.UPDATE,
        replacements: {
            idEvent,
            image
        }
    })
    return update
}
