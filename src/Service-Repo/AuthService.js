const AuthService = {
    AuthUsers(knex, user, password){
        return knex()
        .insert(user, password)
        .into('users')
        .returning()
        .then((row) => {
            return row[0]
        })
    }
}

module.exports = AuthService