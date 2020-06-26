const express = require('express');
const xss = require('xss');
const ParkService = require('../Service-Repo/ParkService');
const app = require('../app');
const ParkRouter = express.json();

module.exports = ParkRouter