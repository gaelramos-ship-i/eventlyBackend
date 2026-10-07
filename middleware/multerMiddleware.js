const multer = require('multer')

// memoryStorage : le fichier reste en mémoire (req.file.buffer) au lieu
// d'être écrit sur le disque. On veut l'analyser et le compresser avec
// sharp avant de décider si on le stocke, donc pas de fichier temporaire.
const storage = multer.memoryStorage()

// On refuse tout ce qui n'est pas une image
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false)
    }
    cb(null, true)
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max
})

// upload.single('image') attend un champ de formulaire nommé "image"
module.exports = upload.single('image')