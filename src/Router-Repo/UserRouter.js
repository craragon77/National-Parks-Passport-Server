const express = require('express');
const xss = require('xss');
const UserService = require('../Service-Repo/UserService');
const app = require('../app');
const UserRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/basic-auth');

UserRouter
    .route('/')
    .all(requireAuth)
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
    .all(requireAuth)
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
    .all(requireAuth)
    /*.get(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const {username, password} = req.body
        const submittedUsername = {username}
        const submittedPassword = {password}
        if(!username){
            res.status(400).json({
                error: {message: 'Please enter a username'}
            })
        }

        if(!password){
            res.status(400).json({
                error: {message: 'Please enter a password'}
            })
        }

        UserService.findUsers(knexInstance, submittedUsername)
            .then((account) => {
                res.status(200).json('your account was found and accessed! horray!')
            })
            .catch(next)
            
    })*/
    .post(jsonParser, (req, rex, next) => {
        const {username} = req.body
        const user = {username}
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
        UserService.loginUser(knexInstance, user)
            .then(user => {
                res
                .status(201)
                .json(user)
            })
    })

module.exports = UserRouter