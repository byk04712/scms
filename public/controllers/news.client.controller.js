angular.module('webapp')
	.controller('NewsController', ['$scope', 'NewsService', NewsController]);

function NewsController($scope, NewsService) {
	$scope.list = [];

	$scope.formatDate = function(date) {
		if (date) {
			return moment(date).format('LLL');
		}
		return '';
	};

	$scope.loadNews = function() {
		NewsService.list()
			.then(
				function(result) {
					console.log('result = ', result);
					$scope.list = result.data;
				},
				function(error) {
					console.error('loadNews error', error);
				}
			);
	};

	$scope.loadNews();
}