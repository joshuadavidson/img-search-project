const express = require('express');
const compression = require('compression');

//application route modules
var index = require('./routes/index');
var imagesearch = require('./routes/imagesearch');
var history = require('./routes/history');

//set up application
var app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

//compress all server responses
app.use(compression());

//serve static files
app.use(express.static('public'));

//app routes
app.use('/', index);
app.use('/imagesearch', imagesearch);
app.use('/history', history);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if (res.headersSent) {
      res.send('error');
    } else {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port);
