angular.module('webapp')
	.service('NewsService', ['$http', '$q', NewsService]);

function NewsService($http, $q) {

	function handleRequest(method = 'GET', url, data = {}) {
		// 创建一个deferred对象
		var defered = $q.defer();
		
		var config = {
			method: method,
			url: url
		};

		switch(method) {
			case 'GET':
				config.params = data;
				break;
			case 'POST':
				config.data = data;
				break;
			default:
				break;
		}

		$http(config).then(
			function(response) {
				defered.resolve(response);
			},
			function(error) {
				defered.reject(error);
			}
		);

		return defered.promise;
	}

	return {
		list: function(params) {
			return handleRequest('GET', '/news', params);
		},
		save: function(data) {
			return handleRequest('POST', '/news', data);
		},
		detail: function(id) {
			return handleRequest('GET', `/news/${id}`);
		},
		delete: function(id) {
			return handleRequest('GET', `/news/remove/${id}`);
		}
	};
}