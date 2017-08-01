angular.module('webapp')
	.controller('NewsController', ['$scope', 'NewsService', NewsController]);


function NewsController($scope, NewsService) {
	$scope.list = [];
	$scope.news = {};
	$scope.new = {};
	$scope.pagestart = 1;
	$scope.pagesize = 15;

	// 新增新闻按钮点击
	$scope.addNews = function() {
		// 清空数据绑定
		$scope.new = {};
		$('#modal-editor').modal('show');
	};

	// 保存新闻
	$scope.save = function() {
		console.log('save', $scope.new);

		// 修改
		if ($scope.new._id) {
			console.log('新闻修改');
			NewsService
				.save($scope.new)
				.then(
					function(result) {
						$scope.setAlertMessage('修改成功');
						$('#modal-editor').modal('hide');
						// 清空表单
						$scope.new = {};
						$scope.loadNews();
					},
					function(error) {
						console.log('修改新闻异常', error);
					}
				);
		} else {	// 新增
			console.log('新闻新增');
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
		}
	};

	// 消息提醒
	$scope.setAlertMessage = function(msg) {
		$scope.message = msg;
		$("#alert").addClass('alert-hidden');
		window.setTimeout(function() {
			$("#alert").removeClass('alert-hidden');
		}, 2000);
	};

	// 编辑新闻
	$scope.newsEdit = function(id) {
		NewsService
			.detail(id)
			.then(
				function(result) {
					$scope.new = result.data;
					$('#modal-editor').modal('show');
				},
				function(error) {
					console.error('编辑新闻出错啦', error);
				}
			);
	};

	// 弹出框确认是否删除新闻
	$scope.confirmRemove = function(id) {
		$scope.findNewsById(id);
		$('#modal-confirm').modal('show');
	};

	// 确定删除新闻
	$scope.sureRemove = function(id) {
		// id可以不通过参数传递，通过数据绑定传递 $scope.news._id
		NewsService
			.delete(id)
			.then(
				function(res) {
					$scope.setAlertMessage('删除成功');
					$scope.news = {};
					$scope.loadNews();
					$('#modal-confirm').modal('hide');
				},
				function(err) {
					console.log('删除失败', err);
				}
			);
	};

	// 新闻详情页
	$scope.newsDetail = function(id) {
		$scope.findNewsById(id);
		$('#modal-detail').modal('show');
	};

	$scope.findNewsById = function(id) {
		NewsService
			.detail(id)
			.then(
				function(result) {
					$scope.news = result.data;
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

	$scope.goPage = function(page) {
		$scope.pagestart = page;
		$scope.loadNews();
	};

	// 加载数据
	$scope.loadNews = function() {
		NewsService
			.list({
				pagestart: $scope.pagestart,
				pagesize: $scope.pagesize
			})
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