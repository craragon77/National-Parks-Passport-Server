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
    },
    postNewStamp(knex, newStamp){
        return knex
        .insert(newStamp)
        .into('stampbook')
        .returning()
        .then(rows => {
            return rows[0]
        })
    },
    deleteStamp(knex, stamp_id){
        return knex('stampbook')
        .where({stamp_id})
        .delete()
    },
    updateStamp(knex, stamp_id, newContent){
        return knex('stampbook')
        .where({stamp_id})
        .update(newContent)
    }
}

module.exports = StampBookService