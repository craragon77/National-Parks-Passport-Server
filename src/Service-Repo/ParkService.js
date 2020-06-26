const ParkService = {
    getAllParks(knex){
        return knex.select('*').from('parks')
    },
    getParksByFullName(knex, fullname){
        return knex
        .select()
        .table('parks')
        .where('fullname', fullname)
        .first()
    }
}

module.exports = ParkService