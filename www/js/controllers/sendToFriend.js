'use strict';

angular.module('starter')

.controller('SendToFriendCtrl', function($scope, $rootScope, $state, $stateParams, $http,$location,$ionicPopup, $cordovaToast, $q, SendToFriendService, $ionicHistory, ErrorService, PluginService) {

	$rootScope.toggleMenu = false;
	var address = sessionStorage.getItem('address');
	var proxy =   sessionStorage.getItem('proxy');
	var version = sessionStorage.getItem('version');
	$scope.send = {};
    $scope.postingId = $stateParams.pId;

    /* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });


    $scope.goBack = function(){
		$ionicHistory.goBack();
		//$location.url("home");
	};

    if(localStorage.getItem('profile')){
        $scope.profile = JSON.parse(localStorage.getItem('profile'));
        $scope.send.from = $scope.profile.email;
    }

    $scope.swipBackUrl = $ionicHistory.backView();

    $scope.onSwipeLeft = function(direction){
        //TODO
    }

    $scope.onSwipeRight = function(direction){
        if($scope.swipBackUrl != null && $scope.swipBackUrl != 'null'){
            $location.url($scope.swipBackUrl.url)
        }
    }


	$scope.sendToFriend = function(sendpage){
		$scope.submitted = true;
		if (sendpage.$valid) {
			$scope.submitted = false;
			$scope.send["todo"] =  "sendtofriend";
            $scope.send["pId"] =  $scope.postingId;
            SendToFriendService.sendTo($scope.send).then(function(response){
                if(response.status == 200){
                    if(typeof cordova !== 'undefined'){
                        $cordovaToast.showLongCenter("Message Sent")
                            .then(function(success) {
                              // success
                            }, function (error) {
                              // error
                        });
                    }
                    $ionicHistory.goBack(-2);
                }else{
                    var errorData = ErrorService.errorDialogContent(response.status, response.data, response.message);
                    $scope.errorMessage = errorData.data.error;
                    $scope.errorCode = errorData.data.error_code;
                    $scope.showErr = true;   
                }
            });
		}else{
			$scope.submitted = true;
            var errors = ErrorService.composeErrorMessage(sendpage.$error);
            if(typeof cordova !== 'undefined'){
                $cordovaToast.showLongCenter(errors.toString())
                    .then(function(success) {
                      // success
                    }, function (error) {
                      // error
                });
            }else{
                alert(errors);
            }
		}
	}

});