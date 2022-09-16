/*
    name: ROUTES
    path: src/app/routes.js
    Objective: In this we declare all our routes

*/

const express = require('express');
const router = express.Router();
const transaction = require('./firewall');


//Migration Route
router.get('/', transaction.conversion)
 

module.exports = router;
