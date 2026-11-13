const Event = require('../models/eventModel')

exports.getPendingEvents = async (req, res) => {
    try {
        const events = await Event.getPendingEvents()

        return res.status(200).json({
            events,
            message: 'Événements en attente récupérés.'
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'Erreur lors de la récupération des événements.'
        })
    }
}

exports.moderateEvent = async (req, res) => {
    try {
        const { idEvent } = req.params
        const { status } = req.body

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                message: "Le statut doit être 'approved' ou 'rejected'."
            })
        }

        const event = await Event.getEventById(idEvent)

        if (event.length === 0) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            })
        }

        if (event[0].status_event !== 'pending') {
            return res.status(409).json({
                message: 'Cet événement a déjà été traité.'
            })
        }

        const updatedEvent = await Event.setEventStatus(idEvent, status)

        if (updatedEvent.length === 0) {
            return res.status(409).json({
                message: 'Cet événement a déjà été traité.'
            })
        }

        return res.status(200).json({
            message: status === 'approved'
                ? 'Événement approuvé.'
                : 'Événement rejeté.'
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'Erreur lors de la modération de l’événement.'
        })
    }
}