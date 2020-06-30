const BucketListService = require('../src/Service-Repo/BucketListService');
const knex = require('knex');

describe('BucketListService endpoint', function() {
    let db 
    let testBucketList = [
        {
            user_id: 1,
            park_id: 1
        },
        {
            user_id: 2,
            park_id: 2
        },
        {
            user_id: 3,
            park_id: 3
        }
    ]
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
    describe.only('GET /bucketlist',() => {
        it('resolves all the bucket list items', () => {
            return BucketListService.getAllBucketList(db)
            .then(() => {
                expect(200, testBucketList)
            })
                
        })
    })
})