const express = require('express');
const xss = require('xss');
const UserService = require('../Service-Repo/UserService');
const app = require('../app');
const UserRouter = express.Router();
const jsonParser = express.json();

UserRouter
    .route('/')
    .get((req, res, next) => {
        UserService.getAllUsers(
            req.app.get('db')
        )
        .then(users => {
            res.json(users)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {id, username, password, nickname} = req.body
        const newUser = {id, username, password, nickname}
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
        if(!nickname){
            return res.status(400).json({
                error: {message: 'Please double check to ensure that you have input a valid nickname!'}
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

module.exports = UserRouter