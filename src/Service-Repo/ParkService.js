const ParkService = {
    getAllParks(knex){
        return knex.select().from('parks')
    },
    getParksByFullName(knex, fullname){
        return knex
        .select()
        .from('parks')
        .where('fullname', 'like', '%fullname%')
        //.first()
    }
}

module.exports = ParkService