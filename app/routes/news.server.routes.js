var NewsController = require('../controllers/news.server.controller');

module.exports = function(app) {
	app.route('/news')
		.get(NewsController.list)
		.post(NewsController.save);

	app.route('/news/:id')
		.get(NewsController.get);

	app.param('id', NewsController.getById);

	app.route('/news/remove/:id')
		.get(NewsController.remove);
}