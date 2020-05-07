var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
const mysql = require('mysql');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sendTransactionRouter = require('./routes/sendtransaction');
var requestTransactionRouter = require('./routes/requestTransaction');

var app = express();
app.use(cors());

// SQL Database
const db = mysql.createConnection({
  host: 'localhost',
  user: config.sqluser,
  password: config.sqlpwd,
  database: config.sqldatabse,
  port: 3307
});

// Connection
db.connect((err) => {
  if (err) {
    console.log('Connection err: ', err);
    throw err;
  }

  console.log('Mysql Connected...')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sendtransaction', sendTransactionRouter);
app.use('/reqtransaction', requestTransactionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
