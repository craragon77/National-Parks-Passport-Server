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
    }
}

module.exports = BucketListService