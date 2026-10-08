// active le mode strict de Javascript pour détecter les erreurs courantes et interdire les syntaxes non sécurisés 
'use strict'

const { z } = require('zod')
const validator = require('validator')

const registerSchema = z.object({
    name: z.string()
        .min(2, { error: "Le prénom doit contenir au moins 2 caractères" })
        .max(50, { error: "Le prénom ne peut pas dépasser 50 caractères" })
        .trim(),
    email: z.email({ error: "Adresse email invalid" }).trim().toLowerCase(),
    password: z.string()
        .min(6, { error: "Le mot de passe doit contenir au moins 6 caractères" })
        .regex(/[A-Z]/, { error: "Au moins une majuscule est requise" })
        .regex(/[0-9]/, { error: "Au moins un chiffre est requis" })
        .regex(/[^a-zA-Z0-9]/, { error: "Au moins un caractère spécial est requis" })
}).strict() // Interdit tout champ supplémentaire non défini dans l'objet pour éviter le mass assignement (injection de paramètres non désiré)

/*
                    null    undefined/absent
.nullable()         oui     non
.optional()         non     oui
.nullish()          oui     oui
*/

const loginSchema = z.object({
    email: z.email({ error: "Adresse email invalid" }).trim().toLowerCase(),
    password: z.string()
        .min(6, { error: "Le mot de passe doit contenir au moins 6 caractères" })
        .regex(/[A-Z]/, { error: "Au moins une majuscule est requise" })
        .regex(/[0-9]/, { error: "Au moins un chiffre est requis" })
        .regex(/[^a-zA-Z0-9]/, { error: "Au moins un caractère spécial est requis" })
}).strict()

module.exports = { registerSchema, loginSchema }