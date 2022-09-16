/*
    name: SERVER (Main starting Point)
    path: src/server.js
    Objective: This is the main server file, here  we run our server , error handling and this is the main point to go to the routes file.
    next File: server > routes
*/
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./app/routes.js')
const http = require('http');
var cors = require('cors')
app.use(cors())

//requiring dotenv file so we can access all variables using process.env.VARIABLE
require('dotenv').config()

// bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes)

// === BOILERPLATE ===
// Catch and send error messages
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message)
    if (!err.statusCode) {
      err.statusCode = 500
    } // Set 500 server code error if statuscode not set
    return res.status(err.statusCode).send({
      statusCode: err.statusCode,
      message: err.message
    })
  }

  next()
})


// when route does not exist it will return a code 404.
app.use(function (req, res) {
  res.status(404).json({
    status: 'Page does not exist'
  });
});

//test1
const PORT = process.env.PORT || 5008

const server = http.createServer(app);



//starting the server
server.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
})