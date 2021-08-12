'use strict';
angular.module('starter').service('ClassifiedService', function( $rootScope ,$http, $q, $location, ConnectivityMonitor, SessionService, ErrorService) {

	this.getClassifieds= function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
        if($rootScope.onlineStatus){
    		$http({method: 'GET',
                url: address+proxy+"/"+version+'/posting/'+queryJson.pId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded',
                           'PROJECT_KEY' :  project_key,
                           'ACCESS_KEY'  :  sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : '',
                           'API_KEY'     :  sessionData !== null && sessionData.api_key !== undefined ? sessionData.api_key : ''
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
            ConnectivityMonitor.offlineMessage();
            deferred.resolve("error");
        }
		return deferred.promise;
	};

    this.getClassifiedDetails= function (queryJson) {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy =   sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
        if($rootScope.onlineStatus){
            $http({method: 'POST',
                url: address+proxy+"/"+version+'/posting/'+queryJson.pId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded',
                           'PROJECT_KEY' :  project_key,
                           'ACCESS_KEY'  :  sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : '',
                           'API_KEY'     :  sessionData !== null && sessionData.api_key !== undefined ? sessionData.api_key : ''
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
            ConnectivityMonitor.offlineMessage();
            deferred.resolve("error");
        }
        return deferred.promise;
    };

    this.setPostingFlag= function (queryJson) {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy =   sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
        if($rootScope.onlineStatus){
            $http({method: 'POST',
                url: address+proxy+"/"+version+"/posting/flag",
                headers: {'Content-Type': 'application/x-www-form-urlencoded',
                           'PROJECT_KEY' :  project_key,
                           'ACCESS_KEY'  :  sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : '',
                           'API_KEY'     :  sessionData !== null && sessionData.api_key !== undefined ? sessionData.api_key : ''
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
            ConnectivityMonitor.offlineMessage();
            deferred.resolve('error');
        }
        return deferred.promise;
    };


    /**
        Service to check whether to dispaly Repost  or not.
    */

    this.isForRepost = function(posting){
        if (!posting) return false;
        var isForRepostFlag;
        if(posting.hasOwnProperty('expiration_date_diff') && posting.expiration_date_diff && posting.expiration_date_diff <= 0){
            isForRepostFlag = true;     
        }else if (posting.active == -5000 || posting.active == -1000) {
            isForRepostFlag = false;  
        }else if (posting.active == 1 && posting.created == 0 ) {
            isForRepostFlag = false;  
        }else if (posting.active == 0 && posting.created == 0 ) {
            isForRepostFlag = false;  
        }else if (posting.active == 1 && posting.created == 1 && (posting.hasOwnProperty('commercial') && (posting.commercial == 1 || posting.commercial == -1))) {
            isForRepostFlag = false;
        }else if (posting.active == 1 && posting.created == 1){
            isForRepostFlag = true;
        }else{
            isForRepostFlag = false;
        }
        return isForRepostFlag;
    };


    /**
        Service to check whether to dispaly Remove  or not.
    */

    this.isForRemove = function(posting){
        if (!posting) return false;
        var isForRemoveFlag;
        if(posting.hasOwnProperty('expiration_date_diff') && posting.expiration_date_diff && posting.expiration_date_diff <= 0){
            isForRemoveFlag = false;
        }else if (posting.active == -5000 || posting.active == -1000) {
            isForRemoveFlag = false;  
        }else if (posting.active == 1 && posting.created == 0 ) {
            isForRemoveFlag = true;  
        }else if (posting.active == 0 && posting.created == 0 ) {
            isForRemoveFlag = false;  
        }else if (posting.active == 1 && posting.created == 1 ) {
            isForRemoveFlag = true;
        }else{
            isForRemoveFlag = false;
        }
        return isForRemoveFlag;
    };

     /**
        Service to check whether to dispaly isActive  or not.
    */

    this.isForActivate = function(posting){
        if (!posting) return false;
        var isActivateFlag;
        if(posting.hasOwnProperty('expiration_date_diff') && posting.expiration_date_diff && posting.expiration_date_diff <= 0){
            isActivateFlag = false;     
        }else if (posting.active == -5000 || posting.active == -1000) {
            isActivateFlag = true;  
        }else if (posting.active == 1 && posting.created == 0 ) {
            isActivateFlag = true;  
        }else if (posting.active == 0 && posting.created == 0 ) {
            isActivateFlag = true;  
        }else if (posting.active == 1 && posting.created == 1 ) {
            isActivateFlag = false;
        }else{
            isActivateFlag = false;
        }
        return isActivateFlag;
    };

    this.isDayAgo = function(posting){
        var isDayAgoFlag;
        if(posting.hasOwnProperty('expiration_date_diff') && posting.expiration_date_diff && posting.expiration_date_diff <= 0){
            isDayAgoFlag = false;     
        }else if (posting.active == -5000 || posting.active == -1000) {
            isDayAgoFlag = false;  
        }else if (posting.active == 1 && posting.created == 0 ) {
            isDayAgoFlag = false;  
        }else if (posting.active == 0 && posting.created == 0 ) {
            isDayAgoFlag = false;  
        }else if (posting.active == 1 && posting.created == 1 ) {
            isDayAgoFlag = true;
        }else{
            isDayAgoFlag = false;
        }
        return isDayAgoFlag;
    };

    

     /**
        Service to check whether to dispaly premium  or not.
    */

    this.isForPremium = function(posting){
        var isForPremiumFlag;
        if(posting.hasOwnProperty('expiration_date_diff') && posting.expiration_date_diff &&  posting.expiration_date_diff <= 0){
            isForPremiumFlag = false;     
        }else if (posting.active == -5000 || posting.active == -1000) {
            isForPremiumFlag = false;  
        }else if (posting.active == 1 && posting.created == 0 && posting.premium == 1) {
            isForPremiumFlag = true;  
        }else if (posting.active == 0 && posting.created == 0 && posting.premium == 1) {
            isForPremiumFlag = true;  
        }else if (posting.active == 1 && posting.created == 1 && posting.premium == 1) {
            isForPremiumFlag = true;
        }else{
            isForPremiumFlag = false;
        }
        return isForPremiumFlag;
    };
});
