process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const environment = require('./environment')
const dotenv = require('dotenv')

module.exports = environment.toWebpackConfig()
dotenv.config()
