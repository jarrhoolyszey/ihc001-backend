const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const URL = process.env.MONGO_URL;

mongoose.connect(URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true,
  useFindAndModify: false,
}).then( () => console.log('Successfully connected to database.'))

mongoose.Promise = global.Promise;


module.exports = mongoose;