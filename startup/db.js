const mongoose = require('mongoose')
const winston = require('winston')

const MongoDBUris = 'mongodb+srv://12345:12345@cluster0.vm5jn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

module.exports = function(){
    mongoose.connect(MongoDBUris, { useFindAndModify: false }, { useNewUrlParser: true }, { useUnifiedTopology: true })
    .then(() => winston.info('Connected to MongoDB...'))
}

