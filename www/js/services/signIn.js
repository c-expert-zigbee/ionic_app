'use strict';
angular.module('starter').service('SignInService', function ($rootScope, $http, $q, $location, ConnectivityMonitor, SessionService, ErrorService) {

	this.login = function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy = sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData = JSON.parse(localStorage.getItem("sessionData"));
		if ($rootScope.onlineStatus) {
			$http({
				method: 'POST',
				url: address + proxy + '/' + version + "/authentication",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'PROJECT_KEY': project_key,
					'ACCESS_KEY': sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : '',
					'API_KEY': sessionData !== null && sessionData.api_key !== undefined ? sessionData.api_key : ''
				},
				data: queryJson,
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				}
			}).success(function (result, status) {
				result['httpStatus'] = status;
				deferred.resolve(result);
			}).error(function (e, status, header) {
				var errorData = ErrorService.parseErrorContent(e, status, header);
				SessionService.setObject('errorObject', errorData);
				deferred.reject;
				$location.url('/errorPage');
			});
		} else {
			ConnectivityMonitor.offlineMessage();
			deferred.resolve('error');
		}
		return deferred.promise;
	};
});
