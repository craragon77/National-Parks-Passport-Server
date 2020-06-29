const StampBookService = {
    getAllStamps(knex){
        return knex.select().from('stampbook')
    },
    getStampById(knex, stamp_id){
        return knex
        .select()
        .from('stampbook')
        .where('stamp_id', stamp_id)
        .first()
    }
}

module.exports = StampBookService