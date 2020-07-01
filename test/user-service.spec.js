const knex = require('knex');
const UserService = require('../src/Service-Repo/UserService');
const app = require('../src/app');
const {makeUserArray} = require('./user.fixtures');

describe(`Users service object`, function() {
    let db
    const testUsers = makeUserArray()
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    before(() => db('users').truncate())

    beforeEach(() => {
        return db
            .into('users')
            .insert(testUsers)
    })

    afterEach(() => db('users').truncate())
    after(() => db.destroy())


    describe('getAllUsers', () => {
        it(`fetches all users from the users table`, () =>{
            return UserService.getAllUsers(db)
                .then(() => {
                    expect(200, testUsers)
                })
        })
    })
    describe('getUserFromId', () => {
        it('fetches a specific user from the id', () => {
            let targetStampId = 1
            let expectedUser = testUsers[0]
            return supertest(app)
                .get(`/users/id/${targetStampId}`)
                .expect(200, expectedUser)
        })
    })
    
})