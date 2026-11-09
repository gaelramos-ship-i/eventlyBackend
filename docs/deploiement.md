# Procédure de déploiement d’Evently

## 1. Prérequis

- Node.js et npm installés.
- Un compte GitHub.
- Un compte Vercel pour le frontend.
- Un hébergeur Node.js pour le backend.
- Une base de données PostgreSQL accessible depuis le backend.
- Un projet Supabase pour le stockage des images d’événements.
- Un compte Brevo pour l’envoi des e-mails de réinitialisation du mot de passe.

Le frontend et le backend sont versionnés dans deux dépôts distincts :

- Frontend : https://github.com/gaelramos-ship-i/evently_frontend
- Backend : https://github.com/gaelramos-ship-i/eventlyBackend

## 2. Installation locale

### Frontend

```bash
git clone https://github.com/gaelramos-ship-i/evently_frontend.git
cd evently_frontend
npm ci
```

Créer un fichier `.env` à la racine du frontend à partir de `.env.example`, puis renseigner l’URL du backend :

```dotenv
VITE_BASE_URL=http://localhost:3000/api/v1
```

Démarrer l’application :

```bash
npm run dev
```

Vite indique dans le terminal l’adresse locale à ouvrir, généralement `http://localhost:5173`.

Commandes disponibles dans le frontend :

```bash
npm run build
npm run preview
```

### Backend

Dans un autre terminal :

```bash
git clone https://github.com/gaelramos-ship-i/eventlyBackend.git
cd eventlyBackend
npm ci
```

Créer un fichier `.env` local et renseigner les variables nécessaires à la base de données, à l’authentification, au stockage des images et à l’envoi des e-mails. Ne jamais publier les valeurs secrètes dans GitHub.

Variables utilisées par le backend :

```dotenv
DATABASE_URI=
JWT_SECRET=
FRONTEND_URL=
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET=
BREVO_SMTP_USER=
BREVO_SMTP_KEY=
EMAIL_USER=
```

La base PostgreSQL doit être accessible avant le démarrage du backend. Le dépôt contient également un fichier `schema.sql` décrivant le schéma de la base.

Démarrer l’API :

```bash
npm start
```

L’application backend utilise actuellement le port `3000`. Vérifier que ce port correspond à la configuration de l’hébergeur choisi.

Commandes de tests présentes dans le backend :

```bash
npm test
npm run test
```

