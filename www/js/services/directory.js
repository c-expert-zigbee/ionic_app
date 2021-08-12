'use strict'; 
angular.module('starter').service('DirectoryService', function( $rootScope ,$http, $q, $location, ConnectivityMonitor, SessionService, StorageService, ErrorService) {

	
	function checkTimeDifference(created_on){
		var created_date = new Date(created_on);
		var diff_minute = (new Date() - created_date)/(1000*60);
		var diff_minute_int = Math.ceil(diff_minute);
		if(diff_minute_int > 10){
			return false;
		}else{
			return true;
		}
	}

	/*

    	serachFieldValidation : This function validates the search query done by user.

    	Added Date : 02/20/2018
    	Issue: #263

    */

	this.serachFieldValidation = function(searchObj){

		var searchFieldErrorObj = { "valid" : true, searchFieldError : ""};
		var searchFieldError = "";

		if(searchObj.itempricemin > searchObj.itempricemax){			
			searchFieldError = searchFieldError.concat(" Item max price must be greater then min price.");
		}
		if(searchObj.housingpricemin > searchObj.housingpricemax){
			searchFieldError = searchFieldError.concat(" Housing max price must be greater then min price.");
		}
		if(searchObj.agemin > searchObj.agemax){
			searchFieldError = searchFieldError.concat(" Max age must be greater then min age.");
		}
		if(searchObj.commercialpricemin > searchObj.commercialpricemax){
			searchFieldError = searchFieldError.concat(" Commercial max price must be greater then min price.");
		}
		if(searchObj.areamin > searchObj.areamax){
			searchFieldError = searchFieldError.concat(" Max area must be greater then min area.");
		}
		if(searchObj.year_from > searchObj.year_to){
			searchFieldError = searchFieldError.concat(" Max year must be greater then min year.");
		}

		if(searchFieldError != ""){
			searchFieldErrorObj.valid = false;
			searchFieldErrorObj.searchFieldError = searchFieldError;
		}

		return searchFieldErrorObj;
	}

	this.getDirectories= function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		var queryUrl = queryJson.url;
		if($rootScope.onlineStatus){
			StorageService.getListing(queryUrl).then(function(result){
				if(result && result.rows && result.rows.length > 0 && checkTimeDifference(result.rows.item(0).created_on)){
					deferred.resolve(JSON.parse(result.rows.item(0).response));
				}else{
					$http({method: 'GET',
			            url: address+queryJson.url,
			            cancel: deferred,
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
			        }).success(function(data){
			        	if(data.status === 200){
				        	StorageService.remove(queryUrl).then(function(res){
								if(res){
				        			StorageService.saveListing(queryUrl, JSON.stringify(data));
				        		}
				        	});
				        }
			        	deferred.resolve(data);
			        }).error(function(e, status, header){
			        	/* 20 feb 2017 :  #102 : return actuall error to error page. */
			        	
			        	var errorData = ErrorService.parseErrorContent(e, status, header);
                		SessionService.setObject('errorObject', errorData);
                		deferred.reject;
                		$location.url('/errorPage');
		            });
				}
			});
        }else{
        	StorageService.getListing(queryUrl).then(function(result){
				if(result && result.rows && result.rows.length > 0){
					deferred.resolve(JSON.parse(result.rows.item(0).response));
				}else{
					//ConnectivityMonitor.offlineMessage();
					deferred.resolve('No ads found');
				}
        	});
        }
		return deferred.promise;
	};


	this.prefetchDirectories= function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		var queryUrl = queryJson.url;
		if($rootScope.onlineStatus){
			StorageService.getListing(queryUrl).then(function(result){
				if(result && result.rows && result.rows.length > 0 && checkTimeDifference(result.rows.item(0).created_on)){
					deferred.resolve(JSON.parse(result.rows.item(0).response));
				}else{
					$http({method: 'GET',
			            url: address+queryJson.url,
			            cancel: deferred,
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
			        }).success(function(data){
			        	if(data.status === 200){
				        	StorageService.remove(queryUrl).then(function(res){
								if(res){
				        			StorageService.saveListing(queryUrl, JSON.stringify(data));
				        		}
				        	});
				        }
			        	deferred.resolve(data);
			        }).error(function(e, status, header){

			        	/* 20 feb 2017 :  #102 : return actuall error to error page. */
                		deferred.resolve('error');

		            });
				}
			});
        }else{
        	StorageService.getListing(queryUrl).then(function(result){
				if(result && result.rows && result.rows.length > 0){
					deferred.resolve(JSON.parse(result.rows.item(0).response));
				}else{
					//ConnectivityMonitor.offlineMessage();
					deferred.resolve('No ads found');
				}
        	});
        }
		return deferred.promise;
	};

	this.getDirectoriesForSync= function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		if($rootScope.onlineStatus){
			$http({method: 'GET',
	            url: address+queryJson.url,
	            //cancel: deferred,
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
	        }).success(function(data){
	        	if(data.status === 200){
		        	StorageService.remove(queryJson.url).then(function(res){
						if(res){
		        			StorageService.saveListing(queryJson.url, JSON.stringify(data));
		        		}
		        	});
		        }
	        	deferred.resolve(data);
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

	this.getDirectoriesForRefresh = function (queryJson) {
		var deferred = $q.defer();
		var address = sessionStorage.getItem('address');
		var proxy =   sessionStorage.getItem('proxy');
		var version = sessionStorage.getItem('version');
		var project_key = sessionStorage.getItem('project_key');
		var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
		if($rootScope.onlineStatus){
			$http({method: 'GET',
	            url: address+queryJson.url,
	            //cancel: deferred,
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
	        }).success(function(data){
	        	var queryUrlRegExp = queryJson.url;
	        	if(data.status === 200){
		        	StorageService.removeByRegexp(queryUrlRegExp).then(function(res){
						if(res){
		        			StorageService.saveListing(queryJson.url, JSON.stringify(data));
		        		}
		        	});
		        }
	        	deferred.resolve(data);
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
})

