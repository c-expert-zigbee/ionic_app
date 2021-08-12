'use strict';
angular.module('starter').service('ForgotPassword', function( $rootScope ,$http, $q, ConnectivityMonitor, SessionService, ErrorService) {
	

	this.sendAuthLink= function (email) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		if($rootScope.onlineStatus){
			$http({method: 'GET',
	            url:  address+proxy+"/"+version+'/authentication?email='+email
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
