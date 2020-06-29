require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const {CLIENT_ORIGIN} = require('./config');
const ParkService = require('./Service-Repo/ParkService');
const ParkRouter = require('./Router-Repo/ParksRouter');
const UserService = require('./Service-Repo/UserService');
const knex = require('knex');
const StampBookService = require('./Service-Repo/StampbookService');
const BucketListService = require('./Service-Repo/BucketListService');
const UserRouter = require('./Router-Repo/UserRouter');
const StampRouter = require('./Router-Repo/StampBookRouter');
const StampBookRouter = require('./Router-Repo/StampBookRouter');
const BucketListRouter = require('./Router-Repo/BucketListRouter');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

app.get('/', (req,res) => {
    res.send('Hello, Dave')
})

app.use('/parks', ParkRouter)

app.use('/users', UserRouter)

app.use('/stampbook', StampBookRouter)

app.use('/bucketlist', BucketListRouter)

/*app.get('/bucketlist', (req, res, next) => {
    const knexInstance = req.app.get('db')
    BucketListService.getAllBucketList(knexInstance)
        .then(bucket => {
            res.json(bucket)
        })
        .catch(next)
})

app.get('/bucketlist/:bucketlistId', (req, res, next) => {
    const knexInstance = req.app.get('db')
    const bucketlist_id = req.params.bucketlistId
    BucketListService.getBucketListById(knexInstance, bucketlist_id)
        .then(id => {
            res.json(id)
        })
        .catch(next)
})
*/
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app