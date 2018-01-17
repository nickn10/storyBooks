const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true })
.then(() => console.log('MongoDB Connected'))
.catch(e => console.log(e));

module.exports = {mongoose};