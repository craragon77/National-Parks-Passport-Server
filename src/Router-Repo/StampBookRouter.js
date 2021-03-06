const express = require('express');
const xss = require('xss');
const StampBookService = require('../Service-Repo/StampBookService');
const StampBookRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/basic-auth');
const { jwtAuth } = require('../middleware/jwt-auth');


StampBookRouter
    .route('/')
    .all(jwtAuth)
    .get((req, res, next) => {
        StampBookService.getAllStamps(
            req.app.get('db')
        )
        .then(stamps => {
            res.json(stamps);
        })
        .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {stamp_id, park_id, stamp_date, comments} = req.body;
        const newStamp = {stamp_id, park_id, stamp_date, comments};
        const knexInstance = req.app.get('db');
        if(!park_id){
            return res.status(400).send({
                error: {message: `Please double check that you are using a proper 'park-id'`}
            });
        }
        newStamp.user_id = req.user.id;
        StampBookService.postNewStamp(knexInstance, newStamp)
            .then(stamp => {
                res
                .status(201)
                .location(`/stampbook/${stamp_id}`)
                .json(stamp);
            })
            .catch(next);
    });

StampBookRouter
    .route('/id/:stampId')
    .all(jwtAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        const stamp_id = req.params.stampId;
        StampBookService.getStampById(
            knexInstance, stamp_id
        )
        .then(stamp => {
            res.json(stamp)
        })
        .catch(next);
    })
    .delete(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        StampBookService.deleteStamp(knexInstance, req.params.stampId)
            .then(() => {
                res
                .status(204)
                .send('stamp successfully deleted!')
                .end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const {park_id, stamp_date, comments} = req.body
        const stampContent = {park_id, stamp_date, comments}
        const patchParamsCheck = Object.values(stampContent).filter(Boolean).length
            if (patchParamsCheck === 0)
                return res.status(404).json({
                    error:{
                        message: `Request must include all necessary parameters. Please double check you have chosen a park, date, and comments to change`
                    }
                });
        stampContent.user_id = req.user.id
        StampBookService.updateStamp(knexInstance, req.params.stampId , stampContent)
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

StampBookRouter
    .route('/userId/:id')
    .get(jwtAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const userId = req.params.id;
        StampBookService.getUserStamp(
            knexInstance, userId
        )
            .then(stamps => {
                res.json(stamps)
            })
            .catch(next);
    });

StampBookRouter
    .route('/stampList/:id')
    .get(jwtAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const userId = req.params.id
        StampBookService.getStampsAndNames(knexInstance, userId)
            .then(stamps => {
                res.json(stamps)
            })
            .catch(next);
    });

StampBookRouter
    .route('/stampInfo/:id')
    .get(jwtAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const stampId = req.params.id
        StampBookService.getStampAndParkById(knexInstance, stampId)
            .then(stamps => {
                res.json(stamps)
            })
            .catch(next);
    });

module.exports = StampBookRouter