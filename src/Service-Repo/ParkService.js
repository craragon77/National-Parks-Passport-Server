const ParkService = {
    getAllParks(knex){
        return knex.select().from('parks')
    },
    getParkByFullName(knex, fullname){
        return knex
        .select()
        .table('parks')
        //.where('fullname', 'like', fullname)
        .where('fullname', 'ilike', `%${fullname}%`)
        //.where('fullname', fullname)
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