const UserService = {
    getAllUsers(knex){
        return knex.select().from('users')
    },
    getUserById(knex, id){
        return knex()
        .from('users')
        .where('id', id)
        .first()
    }
}

module.exports = UserService