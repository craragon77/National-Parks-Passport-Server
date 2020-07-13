const express = require('express');
const xss = require('xss');
const AuthService = require('../Service-Repo/AuthService');
const AuthRouter = express.Router();
const jsonParser = express.json();
const {requireAuth} = require('../middleware/basic-auth')

AuthRouter
    .route('/login')
    .post(requireAuth, jsonParser, (req, res, next) => {
        const {username, password} = req.body
        const loginUser = {username, password}
        //const password = {password}
        const knexInstance = req.app.get('db')

        for (const [key, value] of Object.entries(loginUser))
            if(value == null){
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }
            res.send('ok')

        AuthService.getUserWithUserName(
            req.app.get('db'),
            loginUser.username
        )
            .then(dbUser => {
                if(!dbUser){
                    return res.status(400).json({
                        error: 'Incorrect username or password. Please try again'
                    })
                }
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        if(!compareMatch)
                            return res.status(400).json({
                                error: 'Incorrect username or password, SON!'
                            })
                            const sub = db.user_name
                            const payload = {user_id: db.id}
                            res.send({
                                authToken: AuthService.createJwt(sub, payload)
                            })
                    })
            })
            .catch(next)

        /*if(!username){
           return res.status(400).json({
                error: {messge: 'please enter a username'}
            })
        }
        
        if(!password){
            return res.status(400).json({
                error: {message: 'please enter a password'}
            })
        }
    AuthService.AuthUsers(knexInstance, loggingIn)
        .then(user => {
            res
            .status(201)
            .json(user)
        }) */
})

module.exports = AuthRouter