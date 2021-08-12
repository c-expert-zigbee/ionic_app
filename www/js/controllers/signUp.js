'use strict';

angular.module('starter')

.controller('SignUpCtrl1', function($scope, $rootScope, $state,$http,$location,$ionicPopup, $cordovaToast, $q, PluginService) {

	$rootScope.toggleMenu = false;
	var address = sessionStorage.getItem('address');
	var proxy =   sessionStorage.getItem('proxy');
	var version = sessionStorage.getItem('version');
	$scope.registerData = {};

	$scope.register = function(registerpage){
		$scope.submitted = true;
		
		if (registerpage.$valid) {
			$scope.submitted = false;
		}else{
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