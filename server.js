const express = require('express');

const app = express();

const mongoose    = require('mongoose');

const chalk = require('chalk');
const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

const db = require('./config/db');    //getting db info

mongoose.connect(db.dbURL,{ useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.on('connected', function(){
    console.log(connected("Mongoose default connection is open to ", db.dbURL));
});

connection.on('error', function(err){
    console.log(error("Mongoose default connection has occured "+err+" error"));
});

connection.on('disconnected', function(){
    console.log(disconnected("Mongoose default connection is disconnected"));
});

process.on('SIGINT', function(){
    mongoose.connection.close(function(){
        console.log(termination("Mongoose default connection is disconnected due to application termination"));
        process.exit(0);
    });
});

app.use(express.urlencoded({ extended: true }));

var UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String
});

var Customer = mongoose.model('Customer',UserSchema, 'data' );

app.get('/api/customers', (req, res) => {
  // const customers = [
  //   {id: 1, firstName: 'John', lastName: 'Doe'},
  //   {id: 2, firstName: 'Jane', lastName: 'Smith'},
  //   {id: 3, firstName: 'Sam', lastName: 'Swanson'},
  // ];
  Customer.find({}, function(err, data){
    if(err) {
      res.json(err);
    }
    else {
      res.json(data);
    }
  });
 // res.json(customers);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(connected(`Server is running on PORT ${PORT}`));
});