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

exports.createdEvent = async (name, date, description, address, type, price, userId) => {
    await sequelize.query('INSERT INTO "Events"(name_event, type_event, date_event, address_event, description_event, price_event, fk_id_user) VALUES(:name, :type, :date, :address, :description, :price, :userId)', {
        type: QueryTypes.INSERT,
        replacements: {
            name,
            date,
            description,
            address,
            type,
            price,
            userId,
        }
    })
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
    const event = await sequelize.query(`SELECT * FROM "Events" WHERE "name_event" ILIKE :keyword 
        OR "description_event" ILIKE :keyword 
        OR "address_event" ILIKE :keyword
        OR "type_event" ILIKE :keyword`, {
        type: QueryTypes.SELECT,
        replacements: {
            keyword: `%${keyword}%`
        }
    })
    return event
}
