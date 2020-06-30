const BucketListService = {
    getAllBucketList(knex){
        return knex.select().from('bucketlist')
    },
    getBucketListById(knex, bucketlist_id){
        return knex
        .select()
        .from('bucketlist')
        .where('bucketlist_id', bucketlist_id)
        .first()
    },
    postNewBucketList(knex, newBucketList){
        return knex
        .insert(newBucketList)
        .into('bucketlist')
        .returning()
        .then(rows => {
            return rows[0]
        })
    },
    deleteBucketList(knex, bucketlist_id){
        return knex('bucketlist')
        .where({bucketlist_id})
        .delete()
    },
    updateBucketList(knex, bucketlist_id, newContent){
        return knex('bucketlist')
        .where({bucketlist_id})
        .update(newContent)
    }
}

module.exports = BucketListService