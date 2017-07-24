var NewsController = require('../controllers/news.server.controller');

module.exports = function(app) {
	app.route('/news')
		.get(NewsController.list)
		.post(NewsController.create);

	app.route('/news/:id')
		.get(NewsController.get);

	app.param('id', NewsController.getById);
}