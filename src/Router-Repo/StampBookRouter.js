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
            res.json(stamps)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        //user_id removed from request body as part of the protected endpoints thing-y
        const {stamp_id, park_id, stamp_date, comments} = req.body
        const newStamp = {stamp_id, park_id, stamp_date, comments}
        const knexInstance = req.app.get('db');

        //if(!user_id){
          //  res.status(400).send( {
            //    error: {message: `Please double check that you are using a proper 'user-id'`}
            //})
        //}
        if(!park_id){
            res.status(400).send({
                error: {message: `Please double check that you are using a proper 'park-id'`}
            })
        }
        if(!stamp_date){
            res.status(400).send({
                error: {message: `Please double check that you are using a proper 'stamp_date'`}
            })
        }
        //this will make sure that the server adds the appropriate user_id automatically based on the authorization header (wow!)
        newStamp.user_id = req.user.id
        StampBookService.postNewStamp(knexInstance, newStamp)
            .then(stamp => {
                res
                .status(201)
                //.send(stamp)
                .location(`/stampbook/${stamp_id}`)
                .json(stamp)
            })
            .catch(next)
    })

StampBookRouter
    .route('/id/:stampId')
    .all(jwtAuth)
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
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        //removed user_id from req.body part here cause its a part of the requireAuth function thingy
        const {park_id, stamp_date, comments} = req.body
        const stampContent = {park_id, stamp_date, comments}
        console.log(stampContent)
        console.log(req.params.stampId)
        console.log(req.body)
        const patchParamsCheck = Object.values(stampContent).filter(Boolean).length
            if (patchParamsCheck === 0)
                return res.status(404).json({
                    error:{
                        message: `Request must include all necessary parameters. Please double check you have chosen a park, date, and comments to change`
                    }
                })
        //see comment above for why this is happening here
        stampContent.user_id = req.user.id
        StampBookService.updateStamp(knexInstance, req.params.stampId , stampContent)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = StampBookRouter