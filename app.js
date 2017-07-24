var express = require('./config/express');
var mongodb = require('./config/mongoose');

var app = express();
var db = mongodb();

module.exports = app;