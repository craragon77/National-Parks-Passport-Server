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

    after('cleanup', () => db('stampbook').truncate())

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
    })
})