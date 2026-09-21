const Event = require('../models/eventModel')

// En tant qu’utilisateur inscrit, je veux pouvoir partager un évènement avec la communauté, avec un titre, une date, une description, une adresse, une catégorie, prix.

exports.addEvent = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { name, date, description, address, type, price } = req.body

        if (!name || !date || !description || !address || !type)
            return res.status(400).json({ message: "name, date, description, address, type is required" })

        const eventExist = await Event.isEventExist(userId, name, date)

        if (eventExist.length > 0)
            return res.status(409).json({ message: "This event is already created" })

        await Event.createdEvent(name, date, description, address, type, price, userId)

        res.status(201).json({
            message: 'Event created successfully',
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error adding event"
        });
    }
};

// En tant qu’utilisateur inscrit, je veux pouvoir modifier mon évènement. 

exports.updateEvent = async (req, res) => {
    try {
        const idUser = req.user.id_user
        const { idEvent } = req.params

        const event = await Event.getEventById(idEvent)

        if (event.length === 0)
            return res.status(404).json({ message: "Event not found" })

        if (event[0].fk_id_user !== idUser)
            return res.status(403).json({ message: "You are note the creator of this event" })

        const fields = [];
        const replacements = {
            idEvent
        };

        if (req.body.name != null) {
            fields.push("name_event = :name");
            replacements.name = req.body.name;
        }

        if (req.body.date != null) {
            fields.push("date_event = :date");
            replacements.date = req.body.date;
        }

        if (req.body.description != null) {
            fields.push("description_event = :description");
            replacements.description = req.body.description;
        }

        if (req.body.address != null) {
            fields.push("address_event = :address");
            replacements.address = req.body.address;
        }

        if (req.body.type != null) {
            fields.push("type_event = :type");
            replacements.type = req.body.type;
        }

        if (req.body.price != null) {
            fields.push("price_event = :price");
            replacements.price = req.body.price;
        }

        if (fields.length === 0) {
            return res.status(400).json({
                message: "No fields to update"
            });
        }

        const updatingEvent = await Event.updateEvent(fields, replacements)

        if (updatingEvent)
            return res.status(200).json({ message: "Updating Event successful" })

    } catch (err) {
        return res.status(500).json({
            message: "Error updating event"
        });
    }
}

// En tant qu’utilisateur inscrit, je veux pouvoir supprimer mon évènement.

exports.deleteEvent = async (req, res) => {
    try {
        const idUser = req.user.id_user
        const { idEvent } = req.params

        const event = await Event.getEventById(idEvent)

        if (event.length === 0)
            return res.status(404).json({ message: "Event not found" })

        if (event[0].fk_id_user !== idUser)
            return res.status(403).json({ message: "You are not the creator of this event" })

        const deletingEvent = await Event.deleteEvent(idEvent)

        if (deletingEvent)
            return res.status(200).json({ message: "Deleting Event successful" })

    } catch (err) {
        return res.status(500).json({ message: "Error deleting event" });
    }
}

// En tant qu’utilisateur non-inscrit je veux pouvoir rechercher un évènement.

exports.getEvent = async (req, res) => {
    try {
        const { keyword } = req.query

        if(!keyword)
            return res.status.json({ message: "Keyword is required" })

        const getEvent = await Event.getEvent(keyword)
        if (getEvent)
            return res.status(200).json({
                getEvent,
                message: "Reading event successfull"
            })
    } catch (err) {
        return res.status(500).json({ message: "Error view event" });
    }
}