const Event = require('../models/eventModel')
const User = require('../models/userModel')

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

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        return res.status(200).json({ users })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'Erreur lors de la récupération des utilisateurs.'
        })
    }
}

exports.updateUserRole = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { role } = req.body

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Identifiant invalide.' })
        }

        if (!['member', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Le rôle doit être 'member' ou 'admin'."
            })
        }

        if (id === req.user.id_user && role !== 'admin') {
            return res.status(400).json({
                message: 'Tu ne peux pas retirer ton propre rôle administrateur.'
            })
        }

        const users = await User.setUserRole(id, role)

        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' })
        }

        return res.status(200).json({
            message: 'Rôle utilisateur modifié.',
            user: users[0]
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'Erreur lors de la modification du rôle.'
        })
    }
}

exports.removeUser = async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Identifiant invalide.' })
        }

        if (id === req.user.id_user) {
            return res.status(400).json({
                message: 'Tu ne peux pas supprimer ton propre compte administrateur.'
            })
        }

        const deletedUsers = await User.deleteUser(id)

        if (deletedUsers.length === 0) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' })
        }

        return res.status(200).json({ message: 'Utilisateur supprimé.' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'Erreur lors de la suppression de l’utilisateur.'
        })
    }
}