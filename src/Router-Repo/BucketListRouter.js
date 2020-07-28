const express = require('express');
const xss = require('xss');
const BucketListService = require('../Service-Repo/BucketListService');
const BucketListRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/basic-auth');
const { jwtAuth } = require('../middleware/jwt-auth');

BucketListRouter
    .route('/')
    .all(jwtAuth)
    .get((req, res, next) => {
        BucketListService.getAllBucketList(
            req.app.get('db')
        )
        .then(bucket => {
            res.json(bucket);
        })
        .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {bucketlist_id, park_id} = req.body;
        const newBucketList = {bucketlist_id, park_id};
        const knexInstance = req.app.get('db');
        if(!park_id){
            return res.status(400).send({
                error: {message: `Please double check that you have entered a valid 'park_id'`}
            });
        }
        newBucketList.user_id = req.user.id;

        BucketListService.postNewBucketList(knexInstance, newBucketList)
            .then(bucket => {
                res
                .status(201)
                .location(`/bucketlist/${bucketlist_id}`)
                .json(bucket)
            })
            .catch(next);
    });

BucketListRouter
    .route('/id/:bucketlistId')
    .all(jwtAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        const bucketlist_id = req.params.bucketlistId;
        BucketListService.getBucketListById(knexInstance, bucketlist_id)
            .then(id => {
                res.json(id);
            })
            .catch(next);
    })
    .delete(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        BucketListService.deleteBucketList(
            knexInstance, req.params.bucketlistId
        )
        .then(() => {
            res
            .status(204)
            .end()
        })
        .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const {bucketlistId, park_id} = req.body;
        const bucketlistToUpdate = {park_id};
        const knexInstance = req.app.get('db');
        const bucketlist_id = Object.values({bucketlistId});

        const bucketlistChecker = Object.values(bucketlistToUpdate).filter(Boolean).length;
        if(bucketlistChecker === 0){
            return res.status(404).json({
                error: {
                    message: `bucketlist item not found`
                }
            });
        }
        bucketlistToUpdate.user_id = req.user.id;

        BucketListService.updateBucketList(knexInstance, req.params.bucketlistId , bucketlistToUpdate)
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

BucketListRouter
    .route('/userId/:id')
    .get(jwtAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const user_id = req.params.id;
        BucketListService.getUserBucketlist(knexInstance, user_id)
            .then(id => {
                res.json(id);
            })
            .catch(next);
    });

BucketListRouter
.route('/info/:id')
.get(jwtAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const stampId = req.params.id;
    BucketListService.getBucketlistAndNames(knexInstance, stampId)
        .then(stamps => {
            res.json(stamps);
        })
        .catch(next);
});

module.exports = BucketListRouter