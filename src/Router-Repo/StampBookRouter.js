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
    .post(jsonParser, (req, res, next) => {
        const {user_id, park_id, stamp_date, comments} = req.body
        const newStamp = {user_id, park_id, stamp_date, comments}
        const knexInstance = req.app.get('db');
        StampBookService.postNewStamp(knexInstance, newStamp)
            .then(stamp => {
                res
                .status(201)
                .send(stamp)
                .location(`/stampbook/${stamp_id}`)
                .json(stamp)
            })
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
    .delete(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        StampBookService.deleteStamp(knexInstance, req.params.stampId)
            .then(() => {
                res
                .status(204)
                .send('stamp successfully deleted!')
                .end()
            })
            .catch(next)
    })

module.exports = StampBookRouter