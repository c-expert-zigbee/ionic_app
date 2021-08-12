'use strict';

angular.module('starter')

.controller('ActivateAdSMSCtrl', function($scope,$rootScope,$state,$stateParams,$http,$location,$ionicHistory,$ionicPopup, $cordovaToast, $sce, ClassifiedService, PluginService) {

	if(localStorage.getItem('profile')){
		$scope.profile = JSON.parse(localStorage.getItem('profile'));
	}

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
	
});