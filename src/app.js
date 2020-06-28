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

app.get('/parks',(req, res, next) =>{
    const knexInstance = req.app.get('db')
    ParkService.getAllParks(knexInstance)
        .then(parks => {
            console.log('the parks route is activated')
            res.json(parks)
        })
        .catch(next)
})

app.get('/park/:fullname', (req, res, next) => {
    const knexInstance = req.app.get('db')
    const fullname = req.params.fullname
    ParkService.getParksByFullName(knexInstance, fullname)
        .then(park => {
            console.log('the dynamic path is activated')
            console.log(fullname)
            res.json(park)
        })
        .catch(next)
})

app.get('/users', (req, res, next) => {
    const knexInstance = req.app.get('db')
    UserService.getAllUsers(knexInstance)
        .then(users => {
            console.log(users)
            res.json(users)
        })
        .catch(next)
})

app.get('/stampbook', (req, res, next) => {
    const knexInstance = req.app.get('db')
    StampBookService.getAllStamps(knexInstance)
        .then(stamps => {
            res.json(stamps)
        })
        .catch(next)
})

app.get('/bucketlist', (req, res, next) => {
    const knexInstance = req.app.get('db')
    BucketListService.getAllBucketList(knexInstance)
        .then(bucket => {
            res.json(bucket)
        })
        .catch(next)
})
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