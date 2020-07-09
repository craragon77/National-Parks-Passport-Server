const express = require('express');
const xss = require('xss');
const BucketListService = require('../Service-Repo/BucketListService');
const BucketListRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/basic-auth');

BucketListRouter
    .route('/')
    .all(requireAuth)
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
        const {bucketlist_id, user_id, park_id} = req.body
        const newBucketList = {bucketlist_id, user_id, park_id}
        const knexInstance = req.app.get('db')

        if(!user_id){
            return res.status(400).send({
                error: {message: `Please doublecheck that you have entered a valid 'user_id'`}
            })
        }
        if(!park_id){
            return res.status(400).send({
                error: {message: `Please doublecheck that you have entered a valid 'park_id'`}
            })
        }
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
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const bucketlist_id = req.params.bucketlistId
        BucketListService.getBucketListById(knexInstance, bucketlist_id)
            .then(id => {
                res.json(id)
            })
            .catch(next)
    })
    .delete(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        console.log(req.params.bucketlistId)
        BucketListService.deleteBucketList(
            knexInstance, req.params.bucketlistId
        )
        .then(() => {
            res
            .status(204)
            .end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {bucketlistId, user_id, park_id} = req.body
        const bucketlistToUpdate = {user_id, park_id}
        const knexInstance = req.app.get('db')
        const bucketlist_id = Object.values({bucketlistId})

        console.log(bucketlistToUpdate)
        console.log(req.params.bucketlistId)

        const bucketlistChecker = Object.values(bucketlistToUpdate).filter(Boolean).length
        if(bucketlistChecker === 0){
            return res.status(404).json({
                error: {
                    message: `bucketlist item not found`
                }
            })
        }
        BucketListService.updateBucketList(knexInstance, req.params.bucketlistId , bucketlistToUpdate)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = BucketListRouter