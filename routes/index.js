const express = require('express');
const router = express.Router();

//render just the index page on the index route
router.get('/', function(req, res, next){
  res.render('index');
});

module.exports = router;
