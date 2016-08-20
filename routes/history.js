const express = require('express');
const mongo = require('mongodb').MongoClient;
const router = express.Router();

const mlabURI = process.env.MLAB_URI; //get the DB url from envrionment variable

router.get('/', function(req, res, next) {

  var limit = parseInt(req.query.limit) || 10; //get the limit from the query or default to 10

  mongo.connect(mlabURI).then(function(db) {
    var imgSearchHistory = db.collection('imgSearchHistory'); //get the image search history colleciton

    imgSearchHistory.find({}, {
        _id: false
      })
      .limit(limit) //limit results
      .sort({ $natural: -1 }) //sort so that most recent shows at top of JSON
      .toArray() //convert results to an array

    //once docs are received display them
    .then(docs => {
      res.json(docs); //return the json response of history docs
      db.close(); //close the db
    })

    //catch any errors
    .catch(err => {
      return next(err);
    });
  });

});

module.exports = router;
