const StampbookService = require('../src/Service-Repo/StampBookService');
const knex = require('knex');
const {makeStampsArray} = require('./stamp.fixtures');
const app = require('../src/app');

describe('Stampbook Service file', function(){
    let db
    const testStamps = makeStampsArray()
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })
    
    before('cleanup',() => db('stampbook'))

    beforeEach(() => {
        return db
        .into('stampbook')
        .insert(testStamps)
    })

    after(() => db('stampbook'))

    afterEach('cleanup', () => db('stampbook').truncate())

    describe('/GET stampbook endpoint', () => {
        it('fetches all of the stamps', () => {
            return StampbookService.getAllStamps(db)
                .then(() => {
                    expect(200, testStamps)
                })
        })
        it('fetches a stamp based on the id', () => {
            let targetId = 1
            let expectedStamp = testStamps[targetId - 1]
            console.log(expectedStamp)
            return supertest(app)
                .get(`/stampbook/id/${targetId}`)
                .expect(200, expectedStamp)
        })
    })
    describe('/POST stampbook endpoints', () => {
        it('posts a new stamp to the stampbook backend', () => {
            let newStamp = {
                stamp_id: 420,
                user_id: 1,
                park_id: 1,
                stamp_date: '2020-07-01T11:10:33.586Z',
                comments: 'comment'
            }
            return supertest(app)
                .post('/stampbook')
                .send(newStamp)
                .expect(201)
        }) 
        
        describe(`Stampbook POST validation #ChecksIfThingsAreMissing`, () => {
            it(`responds with 400 + error message if 'user_id' is missing`, () => {
                return supertest(app)
                    .post('/stampbook')
                    .send({
                        stamp_id: 666,
                        park_id: 3,
                        stamp_date: '2020-06-28 14:06:33'
                    })
                    .expect(400,{
                        error: {message: `Please double check that you are using a proper 'user-id'`}
                    })
            })
            it(`responds with 400 + error message if 'park_id' is missing`, () => {
                return supertest(app)
                    .post('/stampbook')
                    .send({
                        stamp_id: 666,
                        user_id: 3,
                        stamp_date: '2020-06-28 14:06:33'
                    })
                    .expect(400,{
                        error: {message: `Please double check that you are using a proper 'park-id'`}
                    })
            })
            it(`responds with 400 + error message if 'stamp_date' is missing`, () => {
                return supertest(app)
                .post('/stampbook')
                .send({
                    stamp_id: 999,
                    user_id: 1,
                    park_id: 1
                })
                .expect(400, {
                    error: {message: `Please double check that you are using a proper 'stamp_date'`}
                })
            })
        })
    })
    describe(`stampbook DELETE endpoint`, () => {
        it('responds with 204 and removes a stamp', () => {
            const stamp_idToRemove = 1
            const expectedStamp = testStamps.filter(stamp => stamp.id !== stamp_idToRemove)
            return supertest(app)
                .delete(`/stampbook/id/${stamp_idToRemove}`)
                .expect(204)
                .then(res => {
                    supertest(app)
                        .get(`/stampbook`)
                        .expect(expectedStamp)
                })
            })
    })
    describe.only(`stampbook PATCH endpoint`, () => {
        it('responds with a 404 if nothing is found', () => {
            const stampId = 123
            return supertest(app)
                .patch(`/stampbook/id/${stampId}`)
                .expect(404, {error: {message: `Request must include all necessary parameters. Please double check you have chosen a park, date, and comments to change`}})
        })
        it(`responds with 204 and updates the stamp`, () => {
            const stampToUpdate = 7
            const updateStamp = {
                user_id: 7,
                park_id: 7,
                stamp_date: "1997-01-01T00:00:00.000Z",
                comments: 'this is a test comment'
            }
            const expectedResponse = {
                ...testStamps[stampToUpdate - 1],
                ...updateStamp
            }
            return supertest(app)
                .patch(`stampbook/id/${stampToUpdate}`)
                .send({
                    ...updateStamp
                })
                .expect(204)
                .then(() => {
                    supertest(app)
                        .get(`/stampbook/id/${stampToUpdate}`)
                        .expect(expectedResponse)
                })
        })
         
    })
})