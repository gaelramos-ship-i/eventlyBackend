const Fav = require('../models/favModel')
const Event = require('../models/eventModel')

exports.addFav = async (req, res) => {
    try {
        const idUser = req.user.id_user
        const { idEvent } = req.params

        const eventExist = await Event.getEventById(idEvent)
        if(eventExist.length === 0)
            return res.status(404).json({ message: "Event not found" })

        const favExist = await Fav.isFavExist(idUser, idEvent)
        if(favExist.length > 0)
            return res.status(409).json({ message: "This event is already in your favoris" })

        const favCreate = await Fav.addFavori(idUser, idEvent)
        if(favCreate)
            return res.status(201).json({ message: "Favori create succesful" })

    } catch (err) {
        return res.status(500).json({ message: "Error adding to favorites" });
    }
};

exports.deleteFav = async (req, res) => {
    try {
        const idUser = req.user.id_user
        const { idEvent } = req.params

        const eventExist = await Event.getEventById(idEvent)
        if(eventExist.length === 0)
            return res.status(404).json({ message: "Event not found" })

        if(eventExist[0].fk_id_user !== idUser)
            return res.status(403).json({ message: "The favorite doesn't belong to you" })

        const deleteFavori = await Fav.deleteFav(idEvent)
        if(deleteFavori)
            return res.status(200).json({ Message: "Favori deleting succesfull" })

    } catch (err) {
        return res.status(500).json({ message: "Error deleting to favorites" })
    }
}