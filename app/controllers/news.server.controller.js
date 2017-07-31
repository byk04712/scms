var mongoose = require('mongoose');
var News = require('../models/news.server.model');


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
console.log('list result , pagestart' + pageStart + ' - pagesize = ' + pageSize);
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
			return next(new Error('News not found'));
		}
		News
			.findOne({ _id: id })
			.exec(function(err, doc) {
				if (err) {
					return next(err);
				}
				if (!doc) {
					return next(new Error('News not found!'));
				}

				req.news = doc;
				return next();
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