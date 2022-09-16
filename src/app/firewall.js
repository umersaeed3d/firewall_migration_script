/*
    name: Firewall (sub-controller)
    path: src/app/firewall.js
    Objective: In this we call the methods from data access layer. this file does not need to know that the function it calling is connected from which database.
    next File: firewall > data-access > index
*/
let transactionsDb = require('../data-access/index');
// console.log(transactionsDb);
let transactions = (module.exports = {});

//function for conversion between cisco and juniper
transactions.conversion = (req, res, next) => {
  transactionsDb.conversion().then(data => {
    res.send(data);
  });
};



