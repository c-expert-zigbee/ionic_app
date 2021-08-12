'use strict';

angular.module('starter')

.controller('postingAdFlagCtrl', function($scope,$rootScope,$state,$stateParams,$http,$location,$ionicHistory,$ionicPopup, $cordovaToast, $sce, ClassifiedService, PluginService) {

    $scope.welcomeMsg = "Thank you for reporting this problem. if enough people (more than one) report the same problem, the ad will be automatically removed.";

    $scope.swipBackUrl = $ionicHistory.backView();

    $scope.onSwipeLeft = function(direction){
        //TODO
    }

    $scope.onSwipeRight = function(direction){
        if($scope.swipBackUrl != null && $scope.swipBackUrl != 'null'){
            $location.url($scope.swipBackUrl.url)
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