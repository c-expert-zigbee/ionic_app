'use strict';
angular.module('starter').service('RegionService', function( $rootScope ,$http, $q, ConnectivityMonitor, SessionService, StorageService) {
	
	function checkTimeDifference(created_on){
		var created_date = new Date(created_on);
		var diff_hour = (new Date() - created_date)/(1000*60*60);
		var diff_hour_int = Math.ceil(diff_hour);
		if(diff_hour_int > 24){
			return false;
		}else{
			return true;
		}
	}

	this.getRegionData= function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		var queryUrl = address+proxy+'/'+version+'/classifieds/'+queryJson.region;
		if($rootScope.onlineStatus){
			StorageService.getRegion(queryUrl).then(function(result){
				if(result && result.rows && result.rows.length > 0 && checkTimeDifference(result.rows.item(0).created_on)){
					deferred.resolve(JSON.parse(result.rows.item(0).response));
				}else{
					$http({method: 'GET',
						url: address+proxy+'/'+version+'/classifieds/'+queryJson.region,
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

					var arr = result.data.categories;
					var uniqueArray = _.uniq(arr,false,function(item,key,value){
						return item.category_id;
					    });
					var resp = result;
					resp.data['categories'] = uniqueArray;
			        	if(resp.data.client_no_cache == 0){
			        		StorageService.saveRegion(queryUrl, JSON.stringify(resp));
			        	}
			        	deferred.resolve(resp);
			        }).error(function(e, status, header){
			        	/* 20 feb 2017 :  #102 : return actuall error to error page. */
			        	ConnectivityMonitor.offlineMessage();
			        	StorageService.getRegion(queryUrl).then(function(result){
							if(result && result.rows && result.rows.length > 0){
								deferred.resolve(JSON.parse(result.rows.item(0).response));
							}else{
								deferred.resolve('error');
							}
						});
		            });
            	}
			});
        }else{
        	StorageService.getRegion(queryUrl).then(function(result){
				if(result && result.rows && result.rows.length > 0){
					deferred.resolve(JSON.parse(result.rows.item(0).response));
				}else{
					ConnectivityMonitor.offlineMessage();
					deferred.resolve('error');
				}
			});
        }
		return deferred.promise;
	};

	this.getRegionDataAtSync= function (queryUrl) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		if($rootScope.onlineStatus){
			$http({method: 'GET',
				url: queryUrl,
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
			var arr = result.data.categories;
			var uniqueArray = _.uniq(arr,false,function(item,key,value){
				return item.category_id;
			    });
			var resp = result;
			resp.data['categories'] = uniqueArray;
	        	if(resp.data.client_no_cache == 0){
	        		StorageService.saveRegion(queryUrl, JSON.stringify(resp));
	        	}
	        	deferred.resolve(resp);
	        }).error(function(e, status, header){

	        	/* 20 feb 2017 :  #102 : return actuall error to error page. */

	        	var errorObj = {"error": e, "status" : status, "header" : header};
	        	SessionService.setObject('errorObject', errorObj);
                deferred.resolve('error');
            });
        }else{
        	ConnectivityMonitor.offlineMessage();
			deferred.resolve('error');
        }
		return deferred.promise;
	};
});
