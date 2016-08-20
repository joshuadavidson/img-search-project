const express = require('express');
const mongo = require('mongodb').MongoClient;
const request = require('request');
const router = express.Router();

const mlabURI = process.env.MLAB_URI; //get the DB url from envrionment variable
const apiKey = process.env.SEARCH_API_KEY; //google custom search api key

router.get('/:query', function(req, res, next) {

  var query = req.params.query; //term to be searched for
  var offset = req.query.offset || 0; //get offset from query or set to 0
  var limit = req.query.limit || 10; //get the number of results to display from the query

  //use microsoft bing image search to get images
  request({
    method: 'GET',
    uri: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey
    },
    qs: {
      q: query, //search term
      count: limit, //number of results to return
      offset: offset //offset from original results
    }
  }, function(err, response, body) {
    if (err) {
      return next(err); //if error exit early and pass to error middleware in app.js
    }
    var searchResults = JSON.parse(body).value; //get the array of results from the response body
    var formattedResults = [];

    //create formatted results for user by looping through the search results
    for (var i = 0; i < searchResults.length; i++) {
      formattedResults.push({
        name: searchResults[i].name, //get the name of the search result
        url: searchResults[i].contentUrl, //get the url of the image from search result
        pageURL: searchResults[i].hostPageDisplayUrl.replace(/r\=(.*)$/, decodeURIComponent("$1")) //get the page the image appears on, needs to be converted from URL encoded with bing returns
      });
    }

    //log the search to the history database before sending results
    mongo.connect(mlabURI).then(db => {
      var imgSearchHistory = db.collection('imgSearchHistory');

      imgSearchHistory.insertOne({
        timestamp: new Date().toISOString(),
        query: query,
      }).then(result => {
        db.close(); //close the db

        //respond with the formatted results after the db has been updated
        res.json(formattedResults);
      }).catch(err => {
        return next(err);
      });
    });

  });
});

module.exports = router;
