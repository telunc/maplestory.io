//Tie the routes to the routers here, and listen.

import express from 'express';
import MarketAPIRouter from './controllers/fm' 

var app = express()

console.log('Started')

app.use('/fm', MarketAPIRouter)

app.listen(8082)