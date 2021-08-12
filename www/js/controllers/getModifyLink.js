'use strict';

angular.module('starter')

.controller('GetModifyLink', function($scope,$rootScope,GetModifyLinkService,$state,$stateParams,$http,$location,$ionicHistory,$ionicPopup, $cordovaToast, $sce, ClassifiedService,PluginService) {

	/* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });

    $scope.modifyLinkObj = {};
  	$scope.getModifyLink = function(modifyAdVerify){
  		$scope.submitted = true;
  		if(modifyAdVerify.$valid){
  			$scope.submitted = false;
  			var link = GetModifyLinkService.getLink($scope.modifyLinkObj);
  			link.then(function(response){
  				$state.go('emailSent');
  			});
  		}else{
  			$scope.submitted = true;
              var errors = [];
              for (var key in modifyAdVerify.$error) {
                  for (var index = 0; index < modifyAdVerify.$error[key].length; index++) {
                      errors.push(modifyAdVerify.$error[key][index].$name + ' is required.');
                  }
              }
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
  		
  	};
});
	