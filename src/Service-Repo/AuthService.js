const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
    AuthUsers(knex, user, password){
        return knex()
        .insert(user, password)
        .into('users')
        .returning()
        .then((row) => {
            return row[0]
        })
    },
    getUserWithUserName(db, username){
        return db('users')
        .where({username})
        .first()
    },
    parseBasicToken(token){
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    },
    comparePasswords(password, hash){
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload){
        return jwt.sign(payload, config.JWT_SECRET, {
            subject, 
            algorithm: 'HS256'
        })
    },
    verfiyJwt(token){
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256']
        })
    }
}

module.exports = AuthService