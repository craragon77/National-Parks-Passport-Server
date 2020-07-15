const express = require('express');
const xss = require('xss');
const UserService = require('../Service-Repo/UserService');
const app = require('../app');
const UserRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/basic-auth');
const { jwtAuth } = require('../middleware/jwt-auth');


UserRouter
    .route('/')
    .get(jwtAuth, (req, res, next) => {
        UserService.getAllUsers(
            req.app.get('db')
        )
        .then(users => {
            res.json(users)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        //gonna leave the username in the request body here because this is to make a new account
        const {username, password} = req.body
        const newUser = {username, password}
        console.log(newUser)
        const knexInstance = req.app.get('db')

        if(!username){
            return res.status(400).json({
                error: {message: 'Please double check to ensure that you have input a valid username!'}
            })
        }
        if(!password){
            return res.status(400).json({
                error: {message: 'Please double check to ensure that you have input a valid password!'}
            })
        }
        UserService.postNewUser(knexInstance, newUser)
            .then(user => {
                res
                .status(201)
                //.send(newUser)
                .location(`/users/id/${newUser}`)
                .json(user)
            })
            .catch(next)
    })

UserRouter
    .route('/id/:id')
    .all(jwtAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UserService.getUserById(
            knexInstance, req.params.id
            )
            .then(user => {
                res.json(user)
            })
            .catch(next)
    })

UserRouter
    .route('/account/')
    .post((req, res, next) => {

    })

module.exports = UserRouter