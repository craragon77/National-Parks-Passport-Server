const AuthService = {
    AuthUsers(knex, user){
        return knex()
        .insert(user)
        .into('users')
        .returning()
        .then((row) => {
            return row[0]
        })
    }
}