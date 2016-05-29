import express from 'express'
import API from '../lib/API'

const router = express.Router()

router.get('/', function (req, res, next) {
  console.log('rendering index')
  res.render('pages/index', {calls: API.availableCalls})
})

export default router
