'use strict';

angular.module('starter')

.controller('ReplyCtrl', function($scope,$rootScope,$state,$stateParams,$http,$location,$sce, $ionicPopup, $timeout, $cordovaToast, ReplyService,$ionicHistory, PluginService,ResponseValidation, ConnectivityMonitor, ErrorService) {
	

	/* Issue #112  admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
      }
    });

	$scope.goBack = function(){	
		if(localStorage.hasOwnProperty('reply-back')){
			$scope.replyBack = JSON.parse(localStorage.getItem('reply-back'));
			$state.go($scope.replyBack.stateName , $scope.replyBack.stateParams);
			localStorage.removeItem("reply-back");
		}else{
			if($ionicHistory.backView()){
				localStorage.removeItem("reply-back");
				$ionicHistory.goBack();
			}else{
				$state.go('home');
			}
		}
			
	};

	$scope.classified = JSON.parse(localStorage.getItem('classified'));
	$scope.subject = "Re: "+$scope.classified.display_title;
	$scope.inputTag = $sce.trustAsHtml('<input type="text">')
	$scope.postingId = $stateParams.pId;
	$scope.showForm = false;
	$scope.profile = JSON.parse(localStorage.getItem('profile'));
	$scope.fromEmail = $scope.profile.email;

	$scope.replyObj = {
		"fromEmail" : $scope.profile.email,
		"subject"   : "Re: "+$scope.classified.display_title
	};

	$rootScope.toggleMenu = false;


	$scope.swipBackUrl = $ionicHistory.backView();

	$scope.onSwipeLeft = function(direction){
		//TODO
	}

	$scope.onSwipeRight = function(direction){
		if($ionicHistory && $ionicHistory.backView().stateName == "signIn"){
			$ionicHistory.goBack(-2);
		}else{
			if($scope.swipBackUrl != null && $scope.swipBackUrl != 'null'){
	        	$location.url($scope.swipBackUrl.url);
	        }
		}
        
	}



	$scope.reply = function(replyToAd){
		$scope.submitted = true;
		if (replyToAd.$valid) {
			$scope.replyObj['parse_message'] = $sce.getTrustedHtml($scope.replyObj.message);
			$scope.replyObj['posting_id'] = $scope.postingId;
			$scope.replyObj['parse_subject'] = $sce.getTrustedHtml($scope.replyObj.subject);
			$scope.replyObj['from_email'] = $scope.fromEmail;

			var reply = ReplyService.sendReply($scope.replyObj);
			reply.then(function(response){	
				try{
					if(response && response.hasOwnProperty('data')){
						$scope.classifiedData = response.data;
						if(typeof cordova !== 'undefined'){
	                        $cordovaToast.showLongCenter("Your reply has been successfully sent.")
	                            .then(function(success) {
	                              // success
	                            }, function (error) {
	                              // error
	                        });
	                    }
	                    if(localStorage.hasOwnProperty('reply-back')){
							$scope.replyBack = JSON.parse(localStorage.getItem('reply-back'));
							$state.go($scope.replyBack.stateName , $scope.replyBack.stateParams);
							localStorage.removeItem("reply-back");
						}else{
							if($ionicHistory.backView()){
								localStorage.removeItem("reply-back");
								$ionicHistory.goBack();
							}else{
								$state.go('home');
							}
						}
						//$location.url('/cls?pId='+$scope.postingId);
						$scope.stop = true;
						//$scope.showForm = true;
					}else if(response.status == 422 && response.data.error == 'Authentication failed'){
		            	if(ResponseValidation.logout()){
							ConnectivityMonitor.authenticationFailedMessage();
							$state.go('signIn');
						}
		            }else{
						$scope.stop = true;
					}
				}
				catch(e){
					$scope.showMessage = true; 
					$scope.errorMessage = "Please, try after sometime. There seems to be some problem.";
				} 
			});
		}else{
			$scope.submitted = true;
            var errors = ErrorService.composeErrorMessage(replyToAd.$error);
            if(typeof cordova !== 'undefined'){
                $cordovaToast.showLongCenter(errors)
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
