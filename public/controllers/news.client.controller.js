angular.module('webapp')
	.controller('NewsController', ['$scope', 'NewsService', NewsController]);


function NewsController($scope, NewsService) {
	$scope.list = [];
	$scope.news = {};
	$scope.new = {};

	// 新增新闻按钮点击
	$scope.addNews = function() {
		$('#modal-editor').modal('show');
	};

	// 保存新闻
	$scope.save = function() {
		console.log('save', $scope.new);
		if (!$scope.new.title) {
			$scope.editerMessage = '新闻标题不能为空';
			$scope.new.titleInvalid = 'has-warning';
			return;
		}
		$scope.new.titleInvalid = '';

		if (!$scope.new.content) {
			$scope.editerMessage = '新闻内容不能为空';
			$scope.new.contentInvalid = 'has-warning';
			return;
		}
		$scope.new.contentInvalid = '';
		$scope.editerMessage = '';

		NewsService
			.save($scope.new)
			.then(
				function(result) {
					console.log('save news success', result);
					$scope.setAlertMessage('保存成功');
					$('#modal-editor').modal('hide');
					// 清空表单
					$scope.new = {};
					$scope.loadNews();

				},
				function(error) {
					console.error('save news fail ', error);
					$scope.editerMessage = error.message || '服务器内部出错！';
				}
			)
	};

	// 消息提醒
	$scope.setAlertMessage = function(msg) {
		$scope.message = '保存成功';
		$("#alert").addClass('alert-hidden');
	};

	// 编辑新闻
	$scope.newsEdit = function(id) {

	};

	// 删除新闻
	$scope.newsRemove = function(id) {

	};

	// 新闻详情页
	$scope.newsDetail = function(id) {
		NewsService
			.detail(id)
			.then(
				function(result) {
					$scope.news = result.data;
					$('#modal-detail').modal('show');
				},
				function(error) {
					console.error('newsDetails error', error);
				}
			);
	};


	// 格式化日期函数
	$scope.formatDate = function(date) {
		if (date) {
			return moment(date).format('LLL');
		}
		return '';
	};

	// 加载所有数据
	$scope.loadNews = function() {
		NewsService.list()
			.then(
				function(result) {
					$scope.list = result.data;
				},
				function(error) {
					console.error('loadNews error', error);
				}
			);
	};

	$scope.loadNews();
}