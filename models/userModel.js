const { sequelize } = require('../config/db')
const { QueryTypes } = require('sequelize')
const bcrypt = require('bcryptjs')

exports.isExistingUser = async (email) => {
    const existingUser = await sequelize.query('SELECT COUNT(email_user) FROM "Users" WHERE email_user = :email', {
        type: QueryTypes.SELECT,
        replacements: { email }
    })
    return existingUser[0].count
}

exports.createUser = async (name, email, password) => {
    const hash = await bcrypt.hash(password, 15)
    const createUser = await sequelize.query('INSERT INTO "Users"(name_user, email_user, pass_user) VALUES (:name, :email, :password)', {
        type: QueryTypes.INSERT,
        replacements: { name, email, password: hash }
    })
    return createUser
}

exports.userQuery = async (email) => {
    const userQuery = await sequelize.query('SELECT * FROM "Users" WHERE email_user = :email', {
        type: QueryTypes.SELECT,
        replacements: { email }
    })
    return userQuery[0]
}

exports.getUserById = async (id) => {
    const user = await sequelize.query('SELECT * FROM "Users" WHERE id_user = :id', {
        type: QueryTypes.SELECT,
        replacements: { id }
    })
    return user
}