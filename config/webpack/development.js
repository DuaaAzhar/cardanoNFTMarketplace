process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.API_URL = process.env.API_URL || 'http://localhost:3000'

const environment = require('./environment')
const dotenv = require('dotenv')

module.exports = environment.toWebpackConfig()
dotenv.config()
