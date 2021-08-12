'use strict';
angular.module('starter').service('RegionListService', function( $rootScope ,$http, $q, $location, ConnectivityMonitor, SessionService,ErrorService) {

	this.getRegionsCategory= function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		if($rootScope.onlineStatus){
			$http({method: 'GET',
				 url: address+proxy+'/'+version+'/classifieds/'+queryJson.region,
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	            transformRequest: function(obj) {
	                var str = [];
	                for(var p in obj)
	                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	                return str.join("&");
	            }
	        }).success(function(result){
	        	deferred.resolve(result);
	        }).error(function(e, status, header){

	        	/* 20 feb 2017 :  #102 : return actuall error to error page. */
	        	
	        	var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        }else{
        	ConnectivityMonitor.offlineMessage();
			deferred.resolve('error');
        }
		return deferred.promise;
	};
});
