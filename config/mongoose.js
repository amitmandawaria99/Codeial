const mongoose = require('mongoose');
const env = require('./environment');
const dotenv = require('dotenv')
dotenv.config()
console.log(process.env.db);
mongoose.connect(process.env.db,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) console.log('Error in Connecting DB')
    else console.log('Database Connected Succesfully')
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to database"));

db.once('open', function () {
  console.log('Connected to Database :: MongoDB');
})

module.exports = db;