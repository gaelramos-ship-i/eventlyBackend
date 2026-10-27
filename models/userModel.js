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

exports.createPasswordResetToken = async (idUser, tokenHash, expiresAt) => {
    await sequelize.query(`
        INSERT INTO "PasswordResetTokens"
            (id_user, token_hash, expires_at)
        VALUES
            (:idUser, :tokenHash, :expiresAt)
    `, {
        replacements: { idUser, tokenHash, expiresAt },
        type: QueryTypes.INSERT
    })
}

exports.getValidPasswordResetToken = async (tokenHash) => {
    const rows = await sequelize.query(`
        SELECT id, id_user
        FROM "PasswordResetTokens"
        WHERE token_hash = :tokenHash
          AND expires_at > NOW()
          AND used = FALSE
    `, {
        replacements: { tokenHash },
        type: QueryTypes.SELECT
    })

    return rows[0] || null
}

exports.resetUserPassword = async (tokenId, idUser, newPassword) => {
    const hash = await bcrypt.hash(newPassword, 15)

    return sequelize.transaction(async (transaction) => {
        // Réserver le jeton : un seul traitement peut réussir.
        const [tokens] = await sequelize.query(`
            UPDATE "PasswordResetTokens"
            SET used = TRUE
            WHERE id = :tokenId
              AND id_user = :idUser
              AND expires_at > NOW()
              AND used = FALSE
            RETURNING id
        `, {
            replacements: { tokenId, idUser },
            transaction
        })

        if (tokens.length === 0) {
            throw new Error('RESET_TOKEN_INVALID')
        }

        await sequelize.query(`
            UPDATE "Users"
            SET pass_user = :password
            WHERE id_user = :idUser
        `, {
            replacements: { password: hash, idUser },
            transaction
        })
    })
}

exports.updateUser = async (id, name, email) => {
    console.log(id)
    const profil = await sequelize.query(`
        UPDATE "Users"
        SET name_user = :name, email_user = :email
        WHERE id_user = :id
    `, {
        replacements: { id, name, email },
        type: QueryTypes.UPDATE
    })
    return profil[0]
}

