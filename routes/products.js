const express = require('express')
const router = express.Router()

const {getAllProductStatic, getAllProducts} = require('../models/product')

router.route('/').get(getAllProducts)
router.route('/static').get(getAllProductStatic)


module.exports =  router