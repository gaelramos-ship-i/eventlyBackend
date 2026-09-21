const { sequelize } = require('../config/db')
const { QueryTypes } = require('sequelize')

exports.addFavori = async (idUser, idEvent) => {
    const addFavori = await sequelize.query(`INSERT INTO "events_has_users" (fk_id_user, fk_id_event) VALUES (:idUser, :idEvent)`, {
        type: QueryTypes.INSERT,
        replacements: {
            idUser,
            idEvent
        }
    })
    return addFavori
}

exports.isFavExist = async (idUser, idEvent) => {
    const addFav = await sequelize.query('SELECT 1 FROM "events_has_users" WHERE fk_id_user = :idUser AND fk_id_event = :idEvent', {
        type: QueryTypes.SELECT,
        replacements: {
            idUser,
            idEvent
        }
    })
    return addFav
}

exports.deleteFav = async (idEvent) => {
    const del = await sequelize.query('DELETE FROM "events_has_users" WHERE fk_id_event = :idEvent', {
        type: QueryTypes.SELECT,
        replacements: {
            idEvent
        }
    })
    return del
}

