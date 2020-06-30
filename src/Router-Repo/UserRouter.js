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
        const {username, password, nickname} = req.body
        const newUser = {username, password, nickname}
        const knexInstance = req.app.get('db')
        UserService.postNewUser(knexInstance, newUser)
            .then(user => {
                res
                .status(201)
                .send(newUser)
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