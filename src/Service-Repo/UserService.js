const REGEX_CHECKER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const bcrypt = require('bcryptjs');

const UserService = {
    getAllUsers(knex){
        return knex.select().from('users')
    },
    getUserById(knex, id){
        return knex()
        .from('users')
        .where('id', id)
        .first()
    },
    postNewUser(knex, newUser){
        return knex()
        .insert(newUser)
        .into('users')
        .returning()
        .then((row) => {
            console.log(row[0])
            return row[0]
            
        })
    },
    validatePassword(password){
        if (password.length < 8 || password.length > 72){
            return 'Password must be between 8 and 72 characters'
        }
        if(password.startsWith(' ') || password.endsWith(' ')){
            return 'Password must not start or end with empty spaces'
        }
        if(!REGEX_CHECKER.test(password)){
            return 'Password must contain 1 upper case, 1 lower case, a numer, and a special character'
        }
        return null
    },
    serializedUser(user){
        return {
            id: user.id,
            fullname: xss(user.fullname),
            password: xss(usern.password)
        }
    },
    hashPassword(password){
        return bcrypt.hash(password, 12)
    },
    hasUserWithUserName(db, username){
        return db('users')
            .where({username})
            .first()
            .then(user => !!user)
    }
}

module.exports = UserService