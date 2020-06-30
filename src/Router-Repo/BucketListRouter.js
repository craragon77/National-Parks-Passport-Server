const express = require('express');
const xss = require('xss');
const BucketListService = require('../Service-Repo/BucketListService');
const BucketListRouter = express.Router();
const jsonParser = express.json();

BucketListRouter
    .route('/')
    .get((req, res, next) => {
        BucketListService.getAllBucketList(
            req.app.get('db')
        )
        .then(bucket => {
            res.json(bucket)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {user_id, park_id} = req.body
        const newBucketList = {user_id, park_id}
        const knexInstance = req.app.get('db')
        BucketListService.postNewBucketList(knexInstance, newBucketList)
            .then(bucket => {
                res
                .status(201)
                .send(newBucketList)
                .location(`/bucketlist/${bucketlist_id}`)
                .json(bucket)
            })
            .catch(next)
    })

BucketListRouter
    .route('/id/:bucketlistId')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const bucketlist_id = req.params.bucketlistId
        BucketListService.getBucketListById(knexInstance, bucketlist_id)
            .then(id => {
                res.json(id)
            })
            .catch(next)
    })

module.exports = BucketListRouter