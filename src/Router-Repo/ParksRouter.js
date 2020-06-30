const express = require('express');
const xss = require('xss');
const ParkService = require('../Service-Repo/ParkService');
const app = require('../app');
const ParkRouter = express.Router();
const jsonParser = express.json();

ParkRouter
    .route('/')
    .get((req, res, next) => {
        ParkService.getAllParks(
            req.app.get('db')
        )
        .then(parks => {
            res.json(parks)
        })
        .catch(next)
    })

ParkRouter
    .route('/name/:fullname')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ParkService.getParkByFullName(
            knexInstance, req.params.fullname
        )
        .then(park => {
            res.json(park)
        })
        .catch(next)
    })
ParkRouter
    .route('/id/:id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ParkService.getParkById(
            knexInstance, req.params.id
        )
        .then(id => {
            res.json(id)
        })
        .catch(next)
    })


module.exports = ParkRouter