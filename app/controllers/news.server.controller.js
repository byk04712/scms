var mongoose = require('mongoose');
var News = require('../models/news.server.model');
var redisClient = require('../../config/redis');


const REDIS_CACHE_PREFIX = 'redis_news_';


// 从数据库中获取
var getNewsFromDB = function(id, cb) {
	console.log('get news from db');
	News
		.findOne({ _id: id })
		.then(function(doc) {
			if (doc) {
				console.log('save news to redis');
				redisClient.set(REDIS_CACHE_PREFIX + id, JSON.stringify(doc));
			}
			return cb(null, doc);
		});
}

// 从redis缓存中获取
var getNewsFromRedis = function(id, cb) {
	console.log('get news from redis');
	redisClient.get(REDIS_CACHE_PREFIX + id, function(err, v) {
		if (err) {
			return cb(err, v);
		}
		if (!v) {
			console.log('Not found in redis');
			return cb(err, v);
		}
		try {
			v = JSON.parse(v);
		} catch(e) {
			return cb(e, v);
		}
		return cb(err, v);
	});
}


module.exports = {
	save: function(req, res, next) {
		var id = req.body._id;

		if (id) {	// 修改
			News.
				updateOne({_id: id}, {
					$set: req.body
				}, function(err, raw) {
					if (err) {
						return next(err);
					}
					return res.json(raw);
				});
		} else {	// 新增
			var news = new News(req.body);
			news.save(function(err) {
				if (err) {
					return next(err);
				}
				return res.json(news);
			});
		}
	},
	list: function(req, res, next) {
		var pageSize = parseInt(req.query.pagesize, 10) || 10;
		var pageStart = parseInt(req.query.pagestart, 10) || 1;
		News
			.find()
			.skip((pageStart - 1) * pageSize)
			.limit(pageSize)
			.exec(function(err, docs) {
				if (err) {
					return next(err);
				}
				return res.json(docs);
			});
	},
	getById: function(req, res, next, id) {
		if (!id) {
			return next(new Error('get news must with id'));
		}
		// 先从redis中获取，如果获取到则直接返回了
		getNewsFromRedis(id, function(err, doc) {
			if (err) {
				return next(err);
			}
			if (!doc) {
				// 从redis中没有获取到值，则从数据库中获取
				getNewsFromDB(id, function(err, doc) {
					if (err) {
						return next(err);
					}
					if (!doc) {
						return next(new Error('News not Found'));
					}
					req.news = doc;
					return next();
				});
			} else {
				req.news = doc;
				return next();
			}
		});
	},
	get: function(req, res, next) {
		return res.json(req.news);
	},
	remove: function(req, res, next) {
		News
			.deleteOne({_id: req.news._id})
			.then(function(result) {
				return res.json(result);
			});
	}
}