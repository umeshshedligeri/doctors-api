const mysql = require("mysql");
const mongoose = require("mongoose");
const Config = require("../config/application");

// var connection = mysql.createPool({
//   host: Config.host,
//   user: Config.user,
//   password: Config.password,
//   database: Config.dbName
// });

// var connection = mysql.createConnection({
//   host: Config.host,
//   user: Config.user,
//   password: Config.password,
//   database: Config.dbName,
//   port : 3306
// });

// connection.connect( function(error) {
//   if(error) throw error;
//   console.log("Connected to database");
// });

// module.exports = connection;