'use strict';

angular.module('starter')

.controller('ClassifiedCtrl', function($scope,$rootScope,$state,$stateParams,$http,$location,$ionicHistory,$ionicPopup, $cordovaToast, $ionicModal, $timeout, $sce, $ionicSlideBoxDelegate, $cordovaClipboard, ClassifiedService, BreadCrumbService, PluginService, ConnectivityMonitor) {
	
	$rootScope.toggleMenu = false;
	$scope.postingId = $stateParams.pId;
	$scope.hideStaticData = true;
	$scope.swipBackUrl = $ionicHistory.backView();
	$scope.regionCode = $stateParams.region;
	$scope.stop = false;

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		viewData.enableBack = true;
	}); 
        
    $scope.share = function(){
    	var address = sessionStorage.getItem('address');
    	var sharingUrl = address+"/cls/"+$scope.classifiedData.posting.posting_id+".html";
    	var description = $scope.classifiedData.posting.description.replace(/<\/?[^>]+(>|$)/g, "");
      	var shortDescription = $scope.classifiedData.posting.display_title + '  ' +description.substring(0,100) + ' ...';
    	//window.plugins.socialsharing.share(shortDescription, "Re: "+$scope.classifiedData.posting.display_title, null, sharingUrl);

        var options = {
		  message: shortDescription, // not supported on some apps (Facebook, Instagram)
		  subject: "Re: "+$scope.classifiedData.posting.display_title, // fi. for email
		  files: null, // ["",""] an array of filenames either locally or remotely
		  url: sharingUrl,
		  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
		}

		var onSuccess = function(result) {
		  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
		  console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
		}

		var onError = function(msg) {
		  console.log("Sharing failed with message: " + msg);
		}

		window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    };

	$scope.emailContactDetails = function(){
	    var link = "mailto:"+$scope.classifiedData.posting.email+"?subject="+"Re: "+$scope.classifiedData.posting.display_title
	    window.location.href = link;
	}

    $scope.modal = $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });


    $scope.reportModel = $ionicModal.fromTemplateUrl('report-abuse-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(reportModel) {
      $scope.reportModel = reportModel;
    });


    $scope.thankyouReportModel = $ionicModal.fromTemplateUrl('thankyou-report-abuse-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(thankyouReportModel) {
      $scope.thankyouReportModel = thankyouReportModel;
    });


    $scope.openModal = function() {
      $scope.modal.show();
      // Important: This line is needed to update the current ion-slide's width
      // Try commenting this line, click the button and see what happens
      $ionicSlideBoxDelegate.update();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.closeThankyouReportAbuseModal = function() {
      $scope.thankyouReportModel.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
    });

    $scope.closeReportModel = function() {
      $scope.reportModel.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.reportModel.remove();
    });
    // Execute action on hide modal
    $scope.$on('reportModel.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('reportModel.removed', function() {
      // Execute action
    });
    $scope.$on('reportModel.shown', function() {
    });

    // Call this functions if you need to manually control the slides
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
  
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
  
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

	$scope.goBack = function(){
		if($stateParams.hasOwnProperty('region') && $stateParams.region != "undefined" && $stateParams.region != undefined && $stateParams.region != ""){
			$location.url("/directory?region="+$stateParams.region+"&regionName="+$stateParams.regionName+"&directory="+$stateParams.directory+"&directoryName="+$stateParams.directoryName);
		}else{
			$location.url("/directory?region=&regionName=&directory="+$stateParams.directory+"&directoryName="+$stateParams.directoryName);
		}
	};

	/*
	    Function which enable swipe left
	    Updated : 27 Feb 2017 - Issue #127 - Allow users to swipe forward and backward between postings.
		Update Description: On swipe left we now goto next posting Ad detail page against the next item
							in the listing. 
    */

	$scope.onSwipeLeft = function(direction){
		if(localStorage.getItem('postingData')){
			$scope.currentIndex = parseInt(localStorage.getItem("postedAdIndex"));
			$scope.postedRegionCode = localStorage.getItem("PostedAdregionCode")
			$scope.postingData = JSON.parse(localStorage.getItem('postingData'));
			if($scope.postingData.length > $scope.currentIndex+1){
				$scope.nextAd = $scope.postingData[$scope.currentIndex+1];
				$scope.nextPostingId = $scope.nextAd.posting_id
				var params = {
                    'pId':$scope.nextPostingId, 
                    'region':$scope.postedRegionCode
                  };
                $state.transitionTo($state.current, params, { reload: true, inherit: true, notify: true });
                localStorage.setItem("postedAdIndex",$scope.currentIndex+1);
			}
		}
		
		
	}


	/*
    	Function which enable swipe right
    	Updated : 27 Feb 2017 - Issue #127 - Allow users to swipe forward and backward between postings.
	    Update Description: On swipe right we now goto previous posting Ad detail page against the previous item
						    in the listing. 
    */

	$scope.onSwipeRight = function(direction){
		if(localStorage.getItem('postingData')){
			$scope.currentIndex = parseInt(localStorage.getItem("postedAdIndex"));
			$scope.postedRegionCode = localStorage.getItem("PostedAdregionCode")
			$scope.postingData = JSON.parse(localStorage.getItem('postingData'));
			if($scope.currentIndex >0){
				$scope.prevAd = $scope.postingData[$scope.currentIndex-1];
				$scope.prevPostingId = $scope.prevAd.posting_id;
				$scope.classifiedData.posting.category_title = $scope.prevAd.category_title;
				var params = {
                    'pId':$scope.prevPostingId, 
                    'region':$scope.postedRegionCode
                  };
                $state.transitionTo($state.current, params, { location: true, reload: true, inherit: true, notify: true });
                localStorage.setItem("postedAdIndex",$scope.currentIndex-1);
			}
		}
		
	}

	/*
    	Function to convert date formate
    */

	$scope.convertDate = function(date){
       return moment(date).format('dddd, MMMM DD, YYYY');
  	};

  	$scope.copyToClipBoard = function(email){
  		$cordovaClipboard.copy(email)
	    .then(function () {
	    	ConnectivityMonitor.clipBoardMessage();
	      // success
	    }, function () {
	      // error
	    });

  	};

	/*
    	Function to Get ads detail by region and category
    */

	if($stateParams.hasOwnProperty("pId")){
		$scope.breadCrumbRegion = localStorage.getItem("breadCrumbRegion");
		var query = $scope.breadCrumbRegion; 
	    $scope.regionName = localStorage.getItem('regionName');
		$scope.regionCode = localStorage.getItem('regionCode');
		var params = {pId : $stateParams.pId};
		var classified = ClassifiedService.getClassifieds(params);
		classified.then(function(response){
			try{
				if(response && response.hasOwnProperty('data')){

					$scope.stop = true;

					$scope.message = "";
					$scope.classifiedData = response.data;
					$scope.hideStaticData = false;

					$scope.regionCodeList =  JSON.parse(localStorage.getItem('regionCodeList'));
					

					$scope.options = {
				      	message: $scope.classifiedData.posting.display_title, // not supported on some apps (Facebook, Instagram)
				      	subject: "Re: "+$scope.classifiedData.posting.display_title, // fi. for email
				      	files: ['', ''], // an array of filenames either locally or remotely
				      	url: 'https://www.expatriates.com/',
				      	chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
				    }
					
					if(localStorage.getItem('category')){
						$scope.directoryName = JSON.parse(localStorage.getItem('category')).title;
			    		$scope.directory = JSON.parse(localStorage.getItem('category')).directory;
					}
			    	
			    	if(!_.contains($scope.regionCodeList, response.data.posting.region_code)){
						$scope.breadCrumbRegion = $scope.breadCrumbRegion.toString() + response.data.posting.region_name+','+response.data.posting.region_code+';';
						
					}



					/* Making breadcrumb */
					var breadCrumb = BreadCrumbService.parseBreadCrumb($scope.breadCrumbRegion);
						breadCrumb = JSON.parse(localStorage.getItem('parseBreadCrumb'));
					
					
				    /* 20 feb 2017 :  #102 :  remove one parameter called type=country which is not used currently */

				    var directoryUrl = "#/directory?region="+$scope.regionCode+"&directory="+$scope.directory+"&directoryName="+$scope.directoryName;
				    breadCrumb.push("<a href='"+directoryUrl+"'>"+$scope.directoryName+"</a>");
				    
				    if(response.data.posting.category_title){
				    	
				    	//localStorage.setItem('subDirectory', JSON.stringify({"title":$scope.directoryName,"directory":$scope.directory}));
				    	/* 20 feb 2017 :  #102 :  remove one parameter called type=country which is not used currently */

				    	var subDirectoryUrl = "#/directory?region="+$scope.regionCode+"&directory="+response.data.posting.directory+"&directoryName="+response.data.posting.category_title;
				        breadCrumb.push("<a href='"+subDirectoryUrl+"'>"+response.data.posting.category_title+"</a>");
				    }

				    $scope.links = breadCrumb;
					localStorage.setItem('classified', JSON.stringify(response.data.posting));

				    
					/* Making image url if picture is present and then pushing it into 
					   an array which is used by ion galley to show images */


					$scope.items = [];
					for (var i=1; i<=8; i++){
						if(response.data.posting['picture'+i] == "1"){
							$scope.hasPictures = true;
							var address = sessionStorage.getItem('address');
							var url = address+"/img/"+response.data.posting.posting_id;
							$scope.items.push({src : url+"."+i+".jpg"});
							if($scope.items.length == 1){
								$scope.firstImageUrl = address+"/img/"+response.data.posting.posting_id+".1.jpg?w=500;h=250";
							}
						}
					}

					/* 18 feb 2017 : #470 : Hiding  and showing AdMob according 
						to the value of show_adsense 
					*/
					if(typeof cordova !== 'undefined'){
						if(response.data.show_adsense == 1){
			            	PluginService.AdMobService(response.data.show_adsense, true);
			            }else{
			              	PluginService.AdMobService(response.data.show_adsense, false);
			            }
			        }
					
				}else if(response === 'error'){
					$scope.stop = true;
					$state.go("errorPage");
				}else{
					$scope.stop = true;
					$scope.message = "No ads found";
				}
			}
			catch(e){
			}
		});
	}else{
		alert("please select any url");
	}


	/*
    	Function to navigate to the reply page  
    */

	$scope.goToReply = function(pId){
		$state.go("reply/:pId",{pId : pId});
	}

	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Please select option'
	   });
	};


	$scope.openReportModal = function(){
		$scope.reportModel.show();
	};

	$scope.setReportFlag = function(flag){
		$scope.currentFlag = flag;
	} 


	$scope.sentToPostingPageExt = function(id){
		if($rootScope.onlineStatus){
			var address = sessionStorage.getItem('address');
			var URL = address+"/cls/"+id+".html";
			window.open(URL, '_system', 'location=yes');
		}
	};

	/*
    	Function which set posting flag as Miscategorized or Prohibited
    	or Spam
    */

	$scope.postingFlag = function(flag){
		$ionicPopup.confirm({
		    title: 'Are you sure to report abuse ?'
		}).then(function(res) {
   			if(res){
   			  	var params = {posting_id : $stateParams.pId, flag: flag};
				var setFlag = ClassifiedService.setPostingFlag(params);
				setFlag.then(function(response){
					try{
						if(response && response.hasOwnProperty('data')){
							$scope.thankyouReportModel.show();
							//$state.go('report');
						}else{
							
						}
					}
					catch(e){
					}
				});
   			}else{
   			  	//console.log('Your name is abcd');
   			}
		});
	};

	$scope.emailToFriend = function(){
		$location.url('sendToFriend?pId='+$scope.postingId);
	};

	
	$scope.checkImageExist = function(data){
  		for (var i=1; i<=8; i++){
			if(data['picture'+i] == "1"){
				$scope.imageIndex = data['picture'+i];
				return true;
				break;
			}
		}
  	}

});
