const swaggerAutogen = require('swagger-autogen')

const doc = {
    info: {
        title: 'API Evently',
        version: '1.0.0',
        description: 'API de découverte et de partage d’événements culturels'
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Serveur local'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
}

const outputFile = './swagger-output.json'
const routes = ['./app.js']

module.exports = swaggerAutogen(outputFile, routes, doc)

// générer le fichier pour swagger avec : 
// node swagger.js
