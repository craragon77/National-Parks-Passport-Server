require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const {CLIENT_ORIGIN} = require('./config');
const ParkRouter = require('./Router-Repo/ParksRouter');
const knex = require('knex');
const UserRouter = require('./Router-Repo/UserRouter');
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