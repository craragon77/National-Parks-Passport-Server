const ParkService = {
    getAllParks(knex){
        return knex.select().from('parks')
    },
    getParkByFullName(knex, fullname){
        return knex
        .select('*')
        .table('parks')
        .where('fullname', 'ilike', `%${fullname}%`)
    },
    getParkById(knex, id){
        return knex
        .select()
        .table('parks')
        .where('id', id)
        .first()
    }
}

module.exports = ParkService