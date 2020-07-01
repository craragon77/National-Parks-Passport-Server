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
        it('gets a bucketlsit item by the id', () => {
            let testId = 1
            let expectedResult = testBucketList[0]
            console.log(expectedResult)
            return supertest(app)
                .get(`/bucketlist/id/${testId}`)
                .expect(200, expectedResult)
        })
    })
    describe('POST bucketlist endpoints', () => {
        it('posts a new bucketlist item', () => {
            let newBucketList = {
                bucketlist_id: 420,
                user_id: 69,
                park_id: 711
            }
            return supertest(app)
                .post('/bucketlist')
                .send(newBucketList)
                .expect(201)
        })
        describe(`Bucketlist POST validation checks`, () => {
            it(`returns 400 + error if the 'user_id' is missing`, () => {
                return supertest(app)
                    .post('/bucketlist')
                    .send({
                        bucketlist_id: 123,
                        park_id: 456
                    })
                    .expect(400, {
                        error: {message: `Please doublecheck that you have entered a valid 'user_id'`}
                    })
            })
            it(`returns 400 + error if the 'park_id' is missing`, () => {
                return supertest(app)
                    .post('/bucketlist')
                    .send({
                        bucketlist_id: 123,
                        user_id: 456
                    })
                    .expect(400, {
                        error: {message: `Please doublecheck that you have entered a valid 'park_id'`}
                    })
            })
        })
    })
    describe.only('Bucketlist Delete endpoint', () => {
        it('deletes the damn delete thingy', () => {
            const idToRemove = 2
            const expectedBucketlist = testBucketList.filter(bucket => bucket.id !== idToRemove)
            return supertest(app)
                .delete(`/bucketlist/id/${idToRemove}`)
                .expect(204)
                .then(res => {
                    supertest(app)
                    .get('/bucketlist')
                    .expect(expectedBucketlist)
                })
        })
    })
    
})