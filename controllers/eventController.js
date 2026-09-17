const { QueryTypes } = require("sequelize")
const { sequelize } = require("../config/db")
const Event = require('../models/eventModel')

// En tant qu’utilisateur inscrit, je veux pouvoir partager un évènement avec la communauté, avec un titre, une date, une description, une adresse, une catégorie, prix.

exports.addEvent = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { name, date, description, address, type, price } = req.body

        if(!name || !date || !description || !address || !type)
            return res.status(400).json({ message: "name, date, description, address, type is required"})

        const eventExist = await Event.isEventExist(userId, name, date)

        if(eventExist.length > 0)
            return res.status(409).json({ message: "This event is already created"})

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
        
        
    } catch (err) {
        return res.status(500).json({
            message: "Error updating event"
        });
    }
}