'use strict';
angular.module('starter').service('ResponseValidation', function( $rootScope ,$http, $q, $state, ConnectivityMonitor) {

	this.validateResponse = function(httpStatus,response, validationRule){
		if(httpStatus == 200 && response.status == 200){
			var result = {validation : true};
			validationRule.forEach(function(data){
				if(result.validation){
					if((data.required == false) || (response.data.hasOwnProperty(data.key) && response.data[data.key] != null )){
						if(typeof response.data[data.key] === data.type){
							if(data.hasOwnProperty('value')){
								if(data.value == response.data[data.key]){
									result.validation = true;
									result.message = response.message ? response.message : 'success';	
								}
								else{
									result.validation = false;
									result.message = 'missing key '+data.key;
								}
								
							}
							else{
								result.validation = true;
								result.message = response.message ? response.message : 'success';
							}
							
						}
						else{
							result.validation = false;
							result.message =  'type mismatch';
						}
						
					}
					else {
						result.validation = false;
						result.message =  'missing key '+data.key;
						///return result;
					}
				}
				
			});

			return result;
		}
		else if(response.status == 422){
			return {validation : false , message : response.message ? response .message : 'Required field error.'};
		}
		else{
			return {validation : false , message :  'Server error.'};
		}
	}

	this.logout = function(){
		if(localStorage.getItem('authenticated')){
			localStorage.removeItem('authenticated');
			localStorage.setItem("sessionData", null);
			localStorage.removeItem('errorObject');
			localStorage.removeItem('currentUserRegion');
			$rootScope.sessionData = localStorage.getItem("sessionData");
			$rootScope.$broadcast('logout', true);
			return true;
		}else{
			return false;
		}
		
	}


});