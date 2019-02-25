var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var lineReader = require('line-reader');
var mongo = require('mongodb');

var index = require('./app_server/routes/index');
var app = express();

//View engine setup
/*
 * To be used only when using Jade
 */
//app.set('views', path.join(__dirname, 'app_server', 'views'));
//app.set('view engine', 'jade');
/*
 * To be used when using HTML
 */

var cons = require('consolidate');
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.static(__dirname));

//app.use(session( {secret: "String for encrypting cookies." } )); --> complains about this
//https://github.com/expressjs/session/issues/438

app.use(session({
secret: 'botnyuserdetails', // session secret
resave: true,
saveUninitialized: true
}));
app.use('/', index);

module.exports = app;
app.listen(3000);
