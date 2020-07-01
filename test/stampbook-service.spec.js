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

    before(() => {
        return db
        .into('stampbook')
        .insert(testStamps)
    })

    after(() => db('stampbook'))

    after('cleanup', () => db('stampbook').truncate())

    describe('Get all stamps', () => {
        it('fetches all of the stamps', () => {
            return StampbookService.getAllStamps(db)
                .then(() => {
                    expect(200, testStamps)
                })
        })
    })
    describe('Get stamp by id', () => {
        //this file is not going well :(
        it('fetches a stamp based on the id', () => {
            let targetId = 1
            let expectedStamp = testStamps[targetId - 1]
            console.log(expectedStamp)
            return supertest(app)
                .get(`/stampbook/id/${targetId}`)
                .expect(200, expectedStamp)
        })
    })
}) 