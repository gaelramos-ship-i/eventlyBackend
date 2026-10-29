# Evently — Backend

Ce dépôt contient l'**API backend** d'Evently, une plateforme communautaire de découverte et de partage d'événements culturels.

Projet réalisé dans le cadre de ma formation Développeur Web et Web Mobile (DWWM).

## Technologies

- Node.js et Express
- PostgreSQL et Sequelize
- JSON Web Token (`jsonwebtoken`) et `bcryptjs`
- Zod et Validator
- Helmet, CORS et Express Rate Limit
- Multer et Sharp pour le traitement de fichiers/images

## Prérequis

- Node.js et npm
- Une base de données PostgreSQL accessible
- Les paramètres de configuration nécessaires au backend

## Installation

```bash
git clone https://github.com/gaelramos-ship-i/eventlyBackend.git
npm install
```

## Configuration

Le dépôt contient un fichier `.env.local` présenté comme une indication des variables à renseigner. Créer sa propre configuration locale avec les valeurs correspondant à son environnement.

Les paramètres nécessaires dépendent de la configuration de la base de données, de l'authentification et des services activés. Consulter les fichiers du dossier `config/` et les variables utilisées dans `app.js` pour connaître les noms exacts attendus.

## Base de données

Le fichier `schema.sql` est fourni à la racine du dépôt. Préparer une base PostgreSQL, consulter ce schéma et appliquer les instructions SQL appropriées à l'environnement utilisé.

La connexion applicative est gérée à travers la configuration du backend et Sequelize.

## Démarrage

```bash
npm start
```

Cette commande exécute `node app.js`. Vérifier le port affiché ou configuré par l'application, puis renseigner son URL dans `VITE_BASE_URL` côté frontend.

## Organisation du projet

```text
app.js           Point d'entrée du serveur
config/          Configuration
controllers/     Traitement des requêtes et logique métier
middleware/      Middlewares
models/          Modèles de données
routes/          Déclaration des routes de l'API
schemas/         Schémas de validation
schema.sql       Schéma SQL
uploads/events/  Répertoire lié aux médias des événements
test/            Fichiers de test présents dans le dépôt
```

## Fonctionnalités principales

L'API est conçue pour les besoins de la plateforme :

- Gestion des comptes et de l'authentification
- Consultation et gestion des événements
- Gestion des favoris
- Validation des données reçues
- Gestion des fichiers/images associés aux événements,

Pour les chemins exacts des endpoints, les méthodes HTTP et les formats des réponses, consulter le dossier `routes/`.

## Frontend

Le frontend React se trouve ici :

https://github.com/gaelramos-ship-i/evently_frontend

## Auteur

Gaël Ramos — Projet de formation DWWM.
