'use strict';

angular.module('starter')

.controller('ActivateSmsOrPhone', function($scope,$rootScope,$state,$stateParams,$http,$location,$ionicHistory,$ionicPopup, $cordovaToast, $sce, $timeout, ClassifiedService, MyAds, PluginService) {
	$scope.activateSms = false;
	$scope.activatePhone = false;
	$scope.processcode = false;
	$scope.activated = false;
	if(localStorage.getItem('profile')){
		$scope.profile = JSON.parse(localStorage.getItem('profile'));
	}
	if(localStorage.getItem('currentAd')){
		$scope.classifiedData = JSON.parse(localStorage.getItem('currentAd'));	
	}
	if(localStorage.getItem('actionType')){
		$scope.actionType = JSON.parse(localStorage.getItem('actionType'));
		if($scope.actionType == "sendsmscode"){
			$scope.activateSms = true;
			$scope.activatePhone = false;
		}
		if($scope.actionType == "savephone"){
			$scope.activatePhone = true;
			$scope.activateSms = false;
		}
	}

	$scope.goToModify = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("modifyAnAd/:pid",{pid : $scope.classifiedData.posting.posting_id});
        });
    };

    $scope.sendActivationCode = function(){
    	$scope.data = {
    		sendsmscode : "yes"
    	}
    	var dialog = PluginService.dialogBox('Sending', 'Please Wait...');
    	MyAds.activateAdSmsOrPhone($scope.classifiedData.posting.posting_id,$scope.data).then(function(response){
    		$timeout(function(){
                dialog.close();
            },2000);
            if(response.status == 200 && response.data.action == "processcode"){
            	$scope.activateSms = false;
            	$scope.activatePhone =false;
            	$scope.processcode = true;

            }else if(response.status == 200 && response.data.action == "default"){
            	$scope.errMessage = response.data.activate;
                $scope.showErr = true;
            }else{
            	$scope.errMessage = "Something went wrong.";
                $scope.showErr = true;
            }
    	});
    };

    $scope.activatePhoneNumber = function(mobileNumber){
        if(mobileNumber != undefined && mobileNumber != ""){
        	$scope.data = {
        		savephone : mobileNumber
        	}
        	var dialog = PluginService.dialogBox('Saving', 'Please Wait...');
        	MyAds.activateAdSmsOrPhone($scope.classifiedData.posting.posting_id,$scope.data).then(function(response){
        		$timeout(function(){
                    dialog.close();
                },2000);
                if(response.status == 200 && response.data.action == "sendsmscode"){
                	$scope.activateSms = true;
                	$scope.activatePhone =false;
                }else if(response.status == 200 && response.data.action == "default" && response.data.activate=="Your ad has been activated. Thank you!"){
                    $scope.activated = true;
                    $scope.activateSms = false;
                    $scope.activatePhone =false;
                    $scope.processcode = false;
                    $scope.errMessage = response.data.activate;

                }else{
                	$scope.errMessage = response.data.activate;
                    $scope.showErr = true;
                }
        	});
        }else{

        }
    };

    $scope.processTheCode = function(code){
        if(code != undefined && code != ""){
            $scope.showErr = false;
            $scope.data = {
                processcode : code
            }
            var dialog = PluginService.dialogBox('Activating', 'Please Wait...');
            MyAds.activateAdSmsOrPhone($scope.classifiedData.posting.posting_id,$scope.data).then(function(response){
                $timeout(function(){
                    dialog.close();
                },2000);
                if(response.status == 200 && response.data.action == "default" && response.data.activate=="Your ad has been activated. Thank you!"){
                    $scope.activated = true;
                    $scope.processcode = false;
                    $scope.errMessage = response.data.activate;
                }else if(response.status == 200 && response.data.action == "processcode"){
                    $scope.errMessage = response.data.activate;
                    $scope.showErr = true;
                }else{
                    $scope.errMessage = response.data.activate;
                    $scope.showErr = true;
                }
            });
        }else{
            $scope.showErr = true;
            $scope.errMessage = "Please, enter OTP.";
        }
    };

    $scope.goToMyAds = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("myAds");
        });
    };


    $scope.goToProfile = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("profile");
        });
    };

    $scope.goBack = function(){
        $state.go("modifyAnAd/:pid",{pid : $scope.classifiedData.posting.posting_id});
    }


    /* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });
	
});
