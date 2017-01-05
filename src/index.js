// Tie the routes to the routers here, and listen.

import express from 'express'
import MapleStoryAPI from './controllers/api'
import Index from './controllers/index'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY } from './environment'
import expressLess from 'express-less'

import Promise from 'bluebird'
import fs from 'fs'
Promise.promisifyAll(fs)

var app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use('/', Index)
app.use('/api', MapleStoryAPI)
app.use('/css', expressLess(__dirname + '/../less', {debug: ENV.NODE_ENV == 'development'}))
app.use(express.static('public'))

app.listen(PORT)

console.log('Listening on', PORT)
