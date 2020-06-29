const express = require('express');
const xss = require('xss');
const StampBookService = require('../Service-Repo/StampBookService');
const StampBookRouter = express.Router();
const jsonParser = express.json();

StampBookRouter
    .route('/')
    .get((req, res, next) => {
        StampBookService.getAllStamps(
            req.app.get('db')
        )
        .then(stamps => {
            res.json(stamps)
        })
        .catch(next)
    })

StampBookRouter
    .route('/id/:stampId')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const stamp_id = req.params.stampId
        StampBookService.getStampById(
            knexInstance, stamp_id
        )
        .then(stamp => {
            res.json(stamp)
        })
        .catch(next)
    })

module.exports = StampBookRouter