var mongoose = require('mongoose');
var config = require('./config');

// Use native promises
mongoose.Promise = global.Promise;


module.exports = function() {
	var db = mongoose.connect(config.mongodb, {
		useMongoClient: true
	});

	require('../app/models/news.server.model');

	return db;
}