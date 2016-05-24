// Tie the routes to the routers here, and listen.

import express from 'express'
import MapleStoryAPI from './controllers/api'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY } from './environment'
import expressLess from 'express-less'

var app = express()

console.log('Started')

app.use('/api', MapleStoryAPI)
app.use('/css', expressLess(__dirname + '/../less', {debug: ENV.NODE_ENV == 'development'}))
app.use(express.static('public'))

app.listen(PORT)
