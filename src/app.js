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
            res.json(parks)
        })
        .catch(next)
})

app.get('/park/:fullname', (req, res, next) => {
    const knexInstance = req.app.get('db')
    ParkService.getParksByFullName(knexInstance, req.params.fullname)
        .then(park => {
            res.json(park)
        })
        .catch(next)
})

app.get('/users', (req, res, next) => {
    const knexInstance = req.app.get('db')
    UserService.getAllUsers(knexInstance)
    .then(users => {
        res.json(users)
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