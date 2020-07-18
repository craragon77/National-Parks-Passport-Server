const express = require('express');
const xss = require('xss');
const UserService = require('../Service-Repo/UserService');
const app = require('../app');
const UserRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/basic-auth');
const { jwtAuth } = require('../middleware/jwt-auth');
const path = require('path');
const bcrypt = require('bcryptjs')


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
        //ok lets get to the bottom of this mystery. How do I decode the encrypted key
        returningUserInfo = req.user
        UserService.getUserById(
            knexInstance, req.params.id
            )
            .then(user => {
                res.json(user)
            })
            .catch(next)
    })

UserRouter
    .route('/newUser/')
    .post(jsonParser, (req, res, next) => {
        const {username, password} = req.body
        const passwordError = UserService.validatePassword(password)
        const knexInstance = req.app.get('db')
        for (const field of ['username', 'password'])
            if(!req.body[field]){
                return res.status(400).json({
                    error: `Missing ${field} in request body`
                })
            }

        if(passwordError){
            return res.status(400).json({
                error: passwordError
            })
        }

        UserService.hasUserWithUserName(knexInstance, username)
            .then(hasUserWithUserName => {
                if (hasUserWithUserName)
                    return res.status(400).json({
                        error: `Username already taken! Please edit your username and try again!`
                    })
            })
            return UserService.hashPassword(password)
                .then(hashedPassword => {
                    const newUser = {
                    username,
                    password: hashedPassword
                }
                    return UserService.postNewUser(knexInstance, newUser)
                        .then(user => {
                            res
                                .status(201)
                                //apparently the location method thingy doesn't want to cooperate with me which is a bummer :(
                                .location(path.posix.join(req.originalUrl, `/${newUser.id}`))
                                .json(newUser)

                        })
                        .catch(next)
                })
            .catch(next)
    })

module.exports = UserRouter