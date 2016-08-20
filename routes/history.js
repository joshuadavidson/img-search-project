const express = require('express');
const mongo = require('mongodb').MongoClient;
const router = express.Router();

const mlabURI = process.env.MLAB_URI; //get the DB url from envrionment variable

router.get('/', function(req, res){

  res.send(mlabURI);
});

module.exports = router;
