'use strict';

angular.module('starter')

.controller('ForgotPassword', function($scope,$rootScope,ForgotPassword,$state,$stateParams,$http,$location,$ionicHistory,$ionicPopup, $cordovaToast, $sce, ClassifiedService, ErrorService, ConnectivityMonitor, PluginService) {

	/* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });

    $scope.goBack = function(){
        $location.url("home");
		/*if($ionicHistory.backView() && $rootScope.onlineStatus){
            $ionicHistory.goBack();
        }else{
            $location.url("home");
        }*/
		//$location.url("home");
	};

    $scope.goBackToSignin = function(){
        $location.url("signIn");
    };

    $scope.sendAuthLink = function(passwordreset,emailAddress){
		if($rootScope.onlineStatus){
            $scope.submitted = true;
            if (passwordreset.$valid) {
                $scope.submitted = false;
                ForgotPassword.sendAuthLink(emailAddress).then(function(response){
                    if(response.status == 200 && response.hasOwnProperty('data')){
                         $state.go('forgotPasswordMessage');
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
                    }
                });
            }else{
                $scope.submitted = true;
                var errors = ErrorService.composeErrorMessage(passwordreset.$error);
                if(typeof cordova !== 'undefined'){
                    $cordovaToast.showLongCenter(errors)
                        .then(function(success) {
                          // success
                        }, function (error) {
                          // error
                    });
                }else{
                    alert(errors);
                }
            }
        }else{
            ConnectivityMonitor.offlineMessage();  
        }
	};

});