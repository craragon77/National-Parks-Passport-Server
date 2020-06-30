const StampbookService = require('../src/Service-Repo/StampBookService');
const knex = require('knex')

describe('Stampbook Service file', function(){
    let db
    let testStamps= [
        {
            user_id: 1,
            park_id: 1,
            comments: 'comment 1'
        },
        {
            user_id: 2,
            park_id: 2,
            comments: 'comment 2'
        },
        {
            user_id: 3,
            park_id: 3,
            comments: 'comment 3'
        }
    ]
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
}) 