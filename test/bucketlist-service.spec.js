const BucketListService = require('../src/Service-Repo/BucketListService');
const knex = require('knex');

describe('BucketListService endpoint', function() {
    let db 
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before('cleanup', () => db('bucketlist').truncate())

    before(() => {
        return db
            .into('bucketlist')
            .insert(testBucketList)
    })

    after(() => db.destroy())

    afterEach(() => db('bucketlist').truncate)
    describe('GET /bucketlist',() => {
        it('resolves all the bucket list items', () => {
            return BucketListService.getAllBucketList(db)
            .then(() => {
                expect(200, testBucketList)
            })
                
        })
    })
})