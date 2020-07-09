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
            return row[0]
        })
    },
    findUsers(knex, username){
        return knex()
        .from('users')
        .where('username', username)
        .first()
    }
}

module.exports = UserService