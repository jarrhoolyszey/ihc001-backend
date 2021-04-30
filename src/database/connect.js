const dotenv = require('dotenv');
const mongoose =require('mongoose');

dotenv.config();

const URL = process.env.MONGO_URL;

console.log('URL: ', URL);

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( () => console.log('Successfully connected to database.'))

mongoose.Promise = global.Promise;


module.exports = mongoose;