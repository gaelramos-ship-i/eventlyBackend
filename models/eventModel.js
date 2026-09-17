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
