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

    describe('GET endpoints', () => {
        it(`fetches all users from the users table`, () =>{
            return UserService.getAllUsers(db)
                .then(() => {
                    expect(200, testUsers)
                })
        })
        it('fetches a specific user from the id', () => {
            let targetStampId = 1
            let expectedUser = testUsers[0]
            return supertest(app)
                .get(`/api/users/id/${targetStampId}`)
                .expect(200, expectedUser)
        })
    })
    describe('Posting endpoint', () => {
        it('posts something and returns a 201 server response', () => {
            let newPost = {
                id: '69',
                username: 'new username',
                password: 'new password',
                nickname: 'new nickname',
            }
            return supertest(app)
                .post(`/api/users`)
                .send(newPost)
                .expect(201)
                .then(res => {
                    console.log(res)
                })
        })
        describe('User Post Validations #ChecksIfThingsAreMissing', () => {
            it(`responds with 400 + error message when a 'username' is missing`, () => {
                return supertest(app)
                    .post('/api/users')
                    .send({
                        id: 69,
                        password: 'new password',
                        nickname: 'new nickname'
                    })
                    .expect(400, {
                        error: {message: 'Please double check to ensure that you have input a valid username!'}
                    })
            })
            it(`responds with 400 + error when a 'password is missing`, () => {
                return supertest(app)
                    .post('/api/users')
                    .send({
                        id: 69,
                        username: 'new username',
                        nickname: 'new nickname'
                    })
                    .expect(400, {
                        error: {message: 'Please double check to ensure that you have input a valid password!'}
                    })
            })
            it(`responds with 400 + error when a 'nickname' is missing`, () => {
                return supertest(app)
                    .post('/api/users')
                    .send({
                        id: 69,
                        username: 'new username',
                        password: 'new password'
                    })
                    .expect(400, {
                        error: {message: 'Please double check to ensure that you have input a valid nickname!'}
                    })
            })
        })
    })
})