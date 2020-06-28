const BucketListService = {
    getAllBucketList(knex){
        return knex.select().from('bucketlist')
    }
}

module.exports = BucketListService