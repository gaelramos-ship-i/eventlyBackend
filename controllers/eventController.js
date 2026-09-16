const { QueryTypes } = require("sequelize")
const { sequelize } = require("../config/db")

// En tant qu’utilisateur inscrit, je veux pouvoir partager un évènement avec la communauté, avec un titre, une date, une description, une adresse, une catégorie, prix.

exports.addEvent = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { name, date, description, address, type, price } = req.body

        if(!name || !date || !description || !address || !type)
            return res.status(400).json({ message: "name, date, description, address, type is required"})

        const eventExist = await sequelize.query(`SELECT id_event FROM "Events" WHERE fk_id_user = :userId AND name_event = :name AND date_event = :date LIMIT 1`, {
            type: QueryTypes.SELECT,
            replacements: {
                userId,
                name,
                date
            }
        })

        if(eventExist.length > 0)
            return res.status(409).json({ message: "This event is already created"})

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

        res.status(201).json({
            message: 'Event created successfully',
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error adding event"
        });
    }
};