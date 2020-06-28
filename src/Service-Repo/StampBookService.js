const StampBookService = {
    getAllStamps(knex){
        return knex.select().from('stampbook')
    }
}

module.exports = StampBookService