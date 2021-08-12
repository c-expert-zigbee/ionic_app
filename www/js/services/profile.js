'use strict';
angular.module('starter').service('Profile', function( $rootScope ,$http, $q, $location, ConnectivityMonitor, SessionService, ErrorService) {

	this.getProfile= function () {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =  sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		if($rootScope.onlineStatus){
            $http({method: 'POST',
                url: address+proxy+'/'+version+"/authentication/myprofile",
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

            	/* 20 feb 2017 :  #102 : return actuall error to error page. */

            	var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });

        }else{
        	//TODO
            ConnectivityMonitor.offlineMessage();
			deferred.resolve('error');
        }
		return deferred.promise;
	}; 

	this.updateProfile= function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =  sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		var project_key = sessionStorage.getItem('project_key');
		if($rootScope.onlineStatus){
            $http({method: 'PUT',
                url: address+proxy+'/'+version+"/authentication/updateprofile?access_key="+sessionData.access_key+"&api_key="+sessionData.api_key,
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
            ConnectivityMonitor.offlineMessage();
			deferred.resolve('error');
        }
		return deferred.promise;
	}; 


});	
