const ParkService = require('../src/Service-Repo/ParkService')
const knex = require('knex')

describe(`Articles service object`, function() {
    let db
    let testParks = [
        {
            states: 'MD',
            image: 'image1.jpg',
            parkcode:'park', 
            id: 420,
            fullname:'Park-1'
        },
        {
            states: 'TU',
            image: 'image2.jpg',
            parkcode:'nuts', 
            id: 69,
            fullname: 'Park-2'
        }
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before('cleanup', () => db('parks').truncate())    

    before(() => {
        return db
            .into('parks')
            .insert(testParks)
    })

    after(() => db.destroy())

    afterEach('cleanup', () => db('parks').truncate())

    describe(`getAllParks()`, () => {
        it(`resolves all parks from parks table`, () =>{
            return ParkService.getAllParks(db)
            .then(() => {
                expect(200, testParks)
            })
        })
    })
    describe.only('getParkbyFullName', () => {
        it(`fetches a single park based on an input name`, () => {
            let fullname = testParks[0].fullname
            return ParkService.getParksByFullName(db)
            .then(parkByName => {
                expect(parkByName).to.eql(fullname)
            })
        })
    })
})