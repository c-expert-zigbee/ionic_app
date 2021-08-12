'use strict';

angular.module('starter')

.controller('RemoveAd', function($scope,$rootScope,MyAds,$cordovaCamera,$state,Upload,$stateParams,$http,$location,$ionicHistory,$ionicPopup, $cordovaToast, $timeout, $sce,ClassifiedService,ResponseValidation,PluginService) {

    $scope.profile = JSON.parse(localStorage.getItem('profile'));
	
    if(localStorage.getItem('currentAd')){
		$scope.classifiedData = JSON.parse(localStorage.getItem('currentAd'));	
	}


    /* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });

	$scope.removeAd = function(){
		var validationRuleObj = [{key : 'remove' , type : 'string', required : true, value : 'success'}];
        var dialog = PluginService.dialogBox('Please Wait...', 'Removing Ad...');
    	MyAds.removeAd($scope.classifiedData.posting.posting_id).then(function(response){
            $timeout(function(){
                dialog.close();
            },2000);
    		$scope.validationResponse = ResponseValidation.validateResponse(response.httpStatus, response, validationRuleObj);
            if($scope.validationResponse.validation == true){
               $state.go('adRemoved');
            }else{
            	$scope.stop = false;
                $scope.errMessage = "Ad could not be removed";
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

    $scope.activateAd = function(){
    	var queryJson = {action : 'activate' }
    	var validationRuleObj = [{key : 'activate' , type : 'string', required : true, value : 'Your ad has been activated. Thank you!'}];
        var dialog = PluginService.dialogBox('Please Wait...', 'Activating Ad...');
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

    $scope.goToMyAds = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("myAds");
        });
    };

    $scope.goToRepost = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("repost");
        });
    };

    $scope.goToModify = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("modifyAnAd/:pid",{pid : $scope.classifiedData.posting.posting_id});
        });
    };
    


    $scope.goToProfile = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("profile");
        });
    };


    /**
        Premium link that goes to web using browser. #93
    */
    
    $scope.premium = function(){
        var address = sessionStorage.getItem('address');
        var URL = address+"/scripts/posting/premium.epl?id="+$scope.classifiedData.posting.unique_id+"&email="+$scope.profile.email;
        if($rootScope.onlineStatus){
            window.open(URL, '_system');
        }else{
            ConnectivityMonitor.offlineMessage();
        }
    }

    /**
        Method to check whether to dispaly isActive  or not.
    */

    $scope.isForActivate = function(){
         $scope.isActivateFlag = ClassifiedService.isForActivate($scope.classifiedData.posting);
         return $scope.isActivateFlag
    }

    /**
        Method to check whether to dispaly Premium  or not.
    */

    $scope.isForPremium = function(){
         $scope.isForPremiumFlag = ClassifiedService.isForPremium($scope.classifiedData.posting);
         return $scope.isForPremiumFlag
    }

    /**
        Method to check whether to dispaly Remove  or not.
    */

    $scope.isForRemove = function(){
         $scope.isForRemoveFlag = ClassifiedService.isForRemove($scope.classifiedData.posting);
         return $scope.isForRemoveFlag
    }

    /**
        Method to check whether to dispaly Repost  or not.
    */


    $scope.isForRepost = function(){
         $scope.isForRepostFlag = ClassifiedService.isForRepost($scope.classifiedData.posting);
         return $scope.isForRepostFlag
    }

    $scope.convertDate = function(date){
         return moment(date).format('dddd, MMMM DD, YYYY');
  	};	
});