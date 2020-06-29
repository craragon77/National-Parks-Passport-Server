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