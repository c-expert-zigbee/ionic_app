'use strict';
angular.module('starter').service('MyAds', function( $rootScope ,$http, $q, $location, ConnectivityMonitor, SessionService,ErrorService) {

	this.myAds= function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		if($rootScope.onlineStatus){
			$http({method: 'POST',
                url: address+proxy+'/'+version+"/authentication/myads"+queryJson,
              	headers: {'Content-Type': 'application/x-www-form-urlencoded',
	        			  'PROJECT_KEY' :  project_key,
                		  'ACCESS_KEY'  :  sessionData.access_key,
                		  'API_KEY'     :  sessionData.api_key
                		 },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function(result){
            	deferred.resolve(result);
            }).error(function(e, status, header){
            	/* 22 july 2017 :  #102 : return actuall error to error page. */
                var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        }else{
            deferred.resolve('error');
            /*ConnectivityMonitor.offlineMessage();
            var errorObj = {"status" : 0, "data": { error: 'Internet connection failed.', error_code : 0}, "message" : 'Internet connection failed.'};
            var errorData = ErrorService.parseErrorContent(errorObj, 0 'header');
            SessionService.setObject('errorObject', errorData);
            deferred.reject;
            $location.url('/errorPage');*/
        }
		return deferred.promise;
	};

    this.searchAds= function (queryJson) {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy =   sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
        if($rootScope.onlineStatus){
            $http({method: 'POST',
                url: address+proxy+'/'+version+"/authentication/myads",
                headers: {'Content-Type': 'application/x-www-form-urlencoded',
                          'PROJECT_KEY' :  project_key,
                          'ACCESS_KEY'  :  sessionData.access_key,
                          'API_KEY'     :  sessionData.api_key
                         },
                data : queryJson,
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
            //TODO
            deferred.resolve('error');
        }
        return deferred.promise;
    };


	this.activateAd= function (postingId,queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		var project_key = sessionStorage.getItem('project_key');
		if($rootScope.onlineStatus){
			$http({method: 'POST',
                url: address+proxy+'/'+version+"/posting/"+postingId+"/activate",
                headers: {'Content-Type': 'application/x-www-form-urlencoded',
	        			  'PROJECT_KEY' :  project_key,
                		  'ACCESS_KEY'  :  sessionData.access_key,
                		  'API_KEY'     :  sessionData.api_key
                		 },
                data : queryJson,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function(result,status){
	        	result['httpStatus'] = status;
            	deferred.resolve(result);
            }).error(function(e, status, header){

            	/* 20 feb 2017 :  #102 : return actuall error to error page. */

            	var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        }else{
        	//TODO
			deferred.resolve('error');
        }
		return deferred.promise;
	};

	this.activateAdSmsOrPhone= function (postingId,queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		var project_key = sessionStorage.getItem('project_key');
		if($rootScope.onlineStatus){
			$http({method: 'POST',
                url: address+proxy+'/'+version+"/posting/"+postingId+"/activate",
                headers: {'Content-Type': 'application/x-www-form-urlencoded',
	        			  'PROJECT_KEY' :  project_key,
                		  'ACCESS_KEY'  :  sessionData.access_key,
                		  'API_KEY'     :  sessionData.api_key
                		 },
                data : queryJson,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function(result,status){
	        	result['httpStatus'] = status;
            	deferred.resolve(result);
            }).error(function(e, status, header){

            	/* 20 feb 2017 :  #102 : return actuall error to error page. */

            	var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        }else{
        	//TODO
			deferred.resolve('error');
        }
		return deferred.promise;
	};

	this.repostAd= function (postingId, queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		var project_key = sessionStorage.getItem('project_key');
		if($rootScope.onlineStatus){
			$http({method: 'POST',
                url: address+proxy+'/'+version+"/posting/"+postingId+"/repost",
                headers: {'Content-Type': 'application/x-www-form-urlencoded',
	        			  'PROJECT_KEY' :  project_key,
                		  'ACCESS_KEY'  :  sessionData.access_key,
                		  'API_KEY'     :  sessionData.api_key
                		 },
                data : queryJson,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function(result,status){
	        	result['httpStatus'] = status;
            	deferred.resolve(result);
            }).error(function(e, status, header){

            	/* 20 feb 2017 :  #102 : return actuall error to error page. */

            	var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        }else{
        	//TODO
			deferred.resolve('error');
        }
		return deferred.promise;
			
	};

	this.removeAd= function(postingId,queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		var project_key = sessionStorage.getItem('project_key');
		if($rootScope.onlineStatus){
			$http({method: 'DELETE',
                url: address+proxy+'/'+version+"/posting/"+postingId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded',
	        			  'PROJECT_KEY' :  project_key,
                		  'ACCESS_KEY'  :  sessionData.access_key,
                		  'API_KEY'     :  sessionData.api_key
                		 },
                data : queryJson,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function(result,status){
	        	result['httpStatus'] = status;
            	deferred.resolve(result);
            }).error(function(e, status, header){

            	/* 20 feb 2017 :  #102 : return actuall error to error page. */
            	
            	var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        }else{
        	//TODO
			deferred.resolve('error');
        }
		return deferred.promise;
			
	};


});
