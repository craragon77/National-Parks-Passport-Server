const express = require('express');
const xss = require('xss');
const AuthService = require('../Service-Repo/AuthService');
const AuthRouter = express.Router();
const jsonParser = express.json();
const {requireAuth} = require('../middleware/basic-auth')

AuthRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const {username, password} = req.body
        const user = {username}
        //const password = {password}
        const knexInstance = req.body.get('db')

        if(!username){
            return res.status(400).json({
                error: {messge: 'please enter a username'}
            })
        }
        
        if(!password){
            return res.status(400).json({
                error: {message: 'please enter a password'}
            })
        }
    AuthService.loginUser(knexInstance, user)
        .then(user => {
            res
            .status(201)
            .json(user)
        })
})