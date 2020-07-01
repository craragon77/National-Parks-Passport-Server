const BucketListService = require('../src/Service-Repo/BucketListService');
const knex = require('knex');
const {makeBucketList} = require('./bucketlist.fixtures');
const app = require('../src/app');

describe('BucketListService endpoint', function() {
    let db 
    const testBucketList = makeBucketList()
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
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
    describe('Get Bucketlist by Id', () => {
        it('gets a bucketlsit item by the id', () => {
            let testId = 1
            let expectedResult = testBucketList[0]
            console.log(expectedResult)
            return supertest(app)
                .get(`/bucketlist/id/${testId}`)
                .expect(200, expectedResult)
        })
    })
})