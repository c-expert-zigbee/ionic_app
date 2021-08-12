'use strict';

angular.module('starter')

.controller('AdRemoved', function($scope, $rootScope, $state,$http,$location,$ionicPopup, $cordovaToast, $q,CreateAccountService,ResponseValidation,MyAds, $timeout, $ionicHistory, $sce, PluginService, ClassifiedService) {

	if(localStorage.getItem('currentAd')){
		$scope.classifiedData = JSON.parse(localStorage.getItem('currentAd'));
        //$sce.trustAsHtml($scope.classifiedData.posting.description)
	}

    $scope.isForActivate = function(){
        if($scope.classifiedData){
            $scope.isForActivateFlag = ClassifiedService.isForActivate($scope.classifiedData.posting);
            return $scope.isForActivateFlag
        } 
    }

    /**
        Method to check whether to dispaly Premium  or not.
    */

    $scope.isForPremium = function(){
        if($scope.classifiedData){
            $scope.isForPremiumFlag = ClassifiedService.isForPremium($scope.classifiedData.posting);
            return $scope.isForPremiumFlag
        }
    }

    /**
        Method to check whether to dispaly Remove  or not.
    */

    $scope.isForRemove = function(){
        if($scope.classifiedData){
            $scope.isForRemoveFlag = ClassifiedService.isForRemove($scope.classifiedData.posting);
            return $scope.isForRemoveFlag
        }
    }

    /**
        Method to check whether to dispaly Repost  or not.
    */

    $scope.isForRepost = function(){
        if($scope.classifiedData){
            $scope.isForRepostFlag = ClassifiedService.isForRepost($scope.classifiedData.posting);
            return $scope.isForRepostFlag
        }
    }


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

	$scope.activateAd = function(){
    	var queryJson = {action : 'activate' }
    	var validationRuleObj = [{key : 'activate' , type : 'string', required : true, value : 'Your ad has been activated. Thank you!'}];
        var dialog = PluginService.dialogBox('Please Wait...', 'Removing Ad...');

    	MyAds.activateAd($scope.classifiedData.posting.posting_id).then(function(response){
            $timeout(function(){
                dialog.close();
            },2000);
    		$scope.validationResponse = ResponseValidation.validateResponse(response.httpStatus, response, validationRuleObj);
    		if($scope.validationResponse.validation == true){
               $state.go('activated');
            }else{
            	$scope.stop = false;
                $scope.errMessage = "Ad could not be activated";
                $scope.showErr = true;
                if(typeof cordova !== 'undefined'){
                    $cordovaToast.showLongCenter($scope.errMessage)
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
    };

    $scope.goToModify = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("modifyAnAd/:pid",{pid : $scope.classifiedData.posting.posting_id});
        });
    };


    /* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });

});