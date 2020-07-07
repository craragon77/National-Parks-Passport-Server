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
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    before('cleanup', () => db('bucketlist').truncate())

    beforeEach(() => {
        return db
            .into('bucketlist')
            .insert(testBucketList)
    })

    after(() => db.destroy())

    afterEach(() => db('bucketlist').truncate())

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
                .get(`/api/bucketlist/id/${testId}`)
                .expect(200, expectedResult)
        })
    })
    describe('POST bucketlist endpoints', () => {
        it('posts a new bucketlist item', () => {
            let newBucketList = {
                bucketlist_id: 5,
                user_id: 5,
                park_id: 5
            }
            return supertest(app)
                .post('/api/bucketlist')
                .send(newBucketList)
                .expect(201)
        })
        describe(`Bucketlist POST validation checks`, () => {
            it(`returns 400 + error if the 'user_id' is missing`, () => {
                return supertest(app)
                    .post('/api/bucketlist')
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
                    .post('/api/bucketlist')
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
    describe('Bucketlist Delete endpoint', () => {
        it('deletes the damn delete thingy', () => {
            const idToRemove = 2
            const expectedBucketlist = testBucketList.filter(bucket => bucket.id !== idToRemove)
            return supertest(app)
                .delete(`/api/bucketlist/id/${idToRemove}`)
                .expect(204)
                .then(() => {
                    supertest(app)
                    .get('/api/bucketlist')
                    .expect(expectedBucketlist)
                })
        })
    })
    describe(`PATCH Bucketlist Endpoints`, () => {
        it(`responds with 404`, ()=> {
            const bucketlistId = 567
            return supertest(app)
                .patch(`/api/bucketlist/id/${bucketlistId}`)
                .expect(404, {
                    error : {
                        message: `bucketlist item not found`
                    }
                })
        })
        it(`responds with 204 and only the expected bucketlist`, () => {
            const idToUpdate = 2
            const updateBucketList = {
                user_id: 7,
                park_id: 7
            }
            const expectedBucketList = {
                ...testBucketList[idToUpdate - 1],
                ...updateBucketList
            }
            return supertest(app)
                .patch(`/api/bucketlist/id/${idToUpdate}`)
                .send({...updateBucketList})
                .expect(204)
                .then(res => {
                    supertest(app)
                        .get(`/api/bucketlist/id/${idToUpdate}`)
                        .expect(expectedBucketList)
                })
        })
    })
})