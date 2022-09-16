/*
    name: CONTROLLER
    path: data-access/index.js
    Objective: In this file we import functions from different databases and export to sub-controller
    next File: index > mongodb > index
*/

// here we import all the functions from MYSQL.
let {
    conversion,
   
  } =
    // switch out db as required
    require('./mongod/index');
  
  
  // console.log();
  
  // here we exporting all the functions to sub-controller.
  let transactionsDb = {
    conversion,
  };
  
  module.exports = transactionsDb;
  