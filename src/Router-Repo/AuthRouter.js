const express = require('express');
const xss = require('xss');
const AuthService = require('../Service-Repo/AuthService');
const AuthRouter = express.Router();
const jsonParser = express.json();
const {requireAuth} = require('../middleware/basic-auth');
const {jwtAuth} = require('../middleware/jwt-auth');

AuthRouter
    .route('/login')
    .post(jsonParser, (req, res, next) => {
        const {username, password} = req.body;
        const loginUser = {username, password};
        const knexInstance = req.app.get('db');

        for (const [key, value] of Object.entries(loginUser))
            if(value == null){
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                });
            }
        AuthService.getUserWithUserName(knexInstance,loginUser.username)
            .then(dbUser => {
                if(!dbUser){
                    return res.status(400).json({
                        error: 'Incorrect username or password. Please try again'
                    });
                }
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        if(!compareMatch)
                            return res.status(400).json({
                                error: 'Incorrect username or password, SON!'
                            });
                        const sub = dbUser.username;
                        const payload = {user_id: dbUser.id};
                        let authToken = `bearer ` + AuthService.createJwt(sub, payload);
                        let storedId = dbUser.id;
                        res.send({
                            authToken,
                            storedId
                        });
                        
                    })
                    .catch(next);
            })
            .catch(next);
});

module.exports = AuthRouter