var mongoose = require('mongoose');
var config = require('./config');

module.exports = function() {
	var db = mongoose.connect(config.mongodb, {
		useMongoClient: true
	});

	require('../app/models/news.server.model');

	return db;
}