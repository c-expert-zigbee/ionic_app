'use strict';

angular.module('starter')

.controller('Activated', function($scope,$rootScope,$state,$stateParams,$http,$location,$ionicHistory,$ionicPopup, $cordovaToast, $sce, ClassifiedService, PluginService, ConnectivityMonitor) {

	if(localStorage.getItem('profile')){
		$scope.profile = JSON.parse(localStorage.getItem('profile'));
	}

	if(localStorage.getItem('currentAd')){
		$scope.classifiedData = JSON.parse(localStorage.getItem('currentAd'));	
	}
	
	$scope.goToModify = function(){
      $ionicHistory.clearCache().then(function(){ 
          $state.go("modifyAnAd/:pid",{pid : $scope.classifiedData.posting.posting_id});
      });
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
      New remove method wich redirect to remove page #93 
    */
    $scope.removeAd = function(){
    if($rootScope.onlineStatus){
      $state.go('removeAd');
    }else{
      ConnectivityMonitor.offlineMessage();
    }
  }


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



  /* Issue #112  admob should only appear on region, listing and posting pages.*/

  document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
  });
	
});