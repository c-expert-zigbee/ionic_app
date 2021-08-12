'use strict';

angular.module('starter')

.controller('SignUpCtrl', function($scope, $rootScope, $state,$http,$location,$ionicPopup, $ionicHistory, $cordovaToast, $q,CreateAccountService, ErrorService, ConnectivityMonitor, PluginService) {

	$rootScope.toggleMenu = false;
	var address = sessionStorage.getItem('address');
	var proxy =   sessionStorage.getItem('proxy');
	var version = sessionStorage.getItem('version');
	$scope.registerData = {};
	
	$scope.goBack = function(){
		 $location.url("home");
		/*if($ionicHistory.backView() && $rootScope.onlineStatus){
			$ionicHistory.goBack();
		}else{
			$location.url("home");
		}*/
		
	};

	$scope.goToSignin = function(){
		//$ionicHistory.goBack();
		$location.url("signIn");
	};

	$scope.register = function(registerpage){
		if($rootScope.onlineStatus){
    		$scope.submitted = true;
			if (registerpage.$valid) {
				$scope.submitted = false;
				CreateAccountService.createAccount($scope.registerData).then(function(response){
					if(response.status == 200 && response.hasOwnProperty('data')){
						if(typeof cordova !== 'undefined'){
			                $cordovaToast.showLongCenter("Account creation successfully done.")
			                    .then(function(success) {
			                      // success
			                    }, function (error) {
			                      // error
			                });
			            }
						$state.go('createAccountMessage');
					}else{
						var errorData = ErrorService.errorDialogContent(response.status, response.data, response.message);
	                    if(errorData.data.hasOwnProperty('status')){
							$scope.errorMessage = errorData.data.error;
	                    	$scope.errorCode = errorData.data.error_code;
						}else{
							$scope.errorMessage = '';
	                    	$scope.errorCode = '';
						}
						$scope.showErr = true;
						if(typeof cordova !== 'undefined'){
			                $cordovaToast.showLongCenter($scope.errorMessage)
			                    .then(function(success) {
			                      // success
			                    }, function (error) {
			                      // error
			                });
			            }else{
			                alert($scope.errMessage);
			            }
					}
				});
			}else{
				$scope.submitted = true;
	            $scope.errors = ErrorService.composeErrorMessage(registerpage.$error);
	            if(typeof cordova !== 'undefined'){
	                $cordovaToast.showLongCenter($scope.errors)
	                    .then(function(success) {
	                      // success
	                    }, function (error) {
	                      // error
	                });
	            }else{
	                alert($scope.errors);
	            }

			}
		}else{
            ConnectivityMonitor.offlineMessage();
        }
			
	}

	/* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });


});