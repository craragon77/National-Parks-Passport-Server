const StampbookService = require('../src/Service-Repo/StampBookService');
const knex = require('knex')

describe('Stampbook Service file', function(){
    let db

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
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
    describe.only('Get stamp by id', () => {
        it('fetches a stamp based on the id', () => {
            let targetId = 1
            let expectedStamp = testStamps[0]
            return supertest()
                .get(`stampbook/${targetId}`)
                .return(200, [expectedStamp])
        })
    })
}) 