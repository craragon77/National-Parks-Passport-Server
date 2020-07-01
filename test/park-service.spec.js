const ParkService = require('../src/Service-Repo/ParkService')
const knex = require('knex')
const app = require('../src/app');
const {makeParksArray} = require('./park.fixtures')

describe(`Articles service object`, function() {
    let db
    const testParks = makeParksArray()
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    before('cleanup', () => db('parks').truncate())    

    beforeEach(() => {
        return db
            .into('parks')
            .insert(testParks)
    })

    after(() => db.destroy())

    afterEach('cleanup', () => db('parks').truncate())

    describe(`get all parks`, () => {
        it(`resolves all parks from parks table`, () =>{
            return ParkService.getAllParks(db)
            .then(() => {
                expect(200, testParks)
            })
        })
    })
    describe('getParkbyFullName', () => {
            it(`fetches a single park based on an input name`, () => {
            let targetFullname = 'Park-1'
            let expectedName = testParks[0]
            console.log(expectedName)
            return supertest(app)
                .get(`/parks/name/${targetFullname}`)
                .expect(200, [expectedName])
        })
    })

})