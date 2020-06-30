const knex = require('knex');
const UserService = require('../src/Service-Repo/UserService');

describe(`Users service object`, function() {
    let db
    let testUsers = [
        {
            id: 1,
            username: 'username-test-1',
            password: 'password-1',
            nickname: 'nickname-1'
        },
        {
            id: 2,
            username: 'username-test-2',
            password: 'password-2',
            nickname: 'nickname-2'
        },
        {
            id: 3,
            username: 'username-test-3',
            password: 'password-3',
            nickname: 'nickname-3'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before(() => db('users').truncate())

    before(() => {
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
    
})