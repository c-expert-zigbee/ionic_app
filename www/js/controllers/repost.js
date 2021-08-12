'use strict';

angular.module('starter')

.controller('RepostCtrl', function($scope,$rootScope,$state,$stateParams,$http,$location,$sce, $ionicPopup, $timeout, $cordovaToast,MyAds,$ionicHistory,ResponseValidation,PluginService) {

	
    /* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });
    
 //    $scope.repost = function(){
	// 	var validationRuleObj = [{key : 'repost' , type : 'string', required : true}];
	// 	var dialog = PluginService.dialogBox('Please Wait...', 'Reposting Ad...');
 //    	MyAds.repostAd($scope.classifiedData.posting.posting_id).then(function(response){
 //    		$timeout(function(){
 //                dialog.close();
 //            },2000);
 //    		$scope.validationResponse = ResponseValidation.validateResponse(response.httpStatus, response, validationRuleObj);
 //    		if($scope.validationResponse.validation == true){
 //               $state.go('repostThankYou');
 //            }else{
 //            	$scope.stop = false;
 //                $scope.errMessage = "Ad could not be reposted";
 //                $scope.showErr = true;
 //                if(typeof cordova !== 'undefined'){
 //                    $cordovaToast.showLongCenter($scope.errMessage)
 //                        .then(function(success) {
 //                          // success
 //                        }, function (error) {
 //                          // error
 //                    });
 //                }else{
 //                    alert($scope.errMessage);
 //                }  
 //            }
 //    	});
	// };
	$scope.goToModify = function(){
        $ionicHistory.clearCache().then(function(){ 
            $state.go("modifyAnAd/:pid",{pid : $scope.classifiedData.posting.posting_id});
        });
    };

	if(localStorage.getItem('currentAd')){
		$scope.classifiedData = JSON.parse(localStorage.getItem('currentAd'));	
	}

});