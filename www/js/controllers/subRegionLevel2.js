'use strict';

angular.module('starter')

.controller('SubRegionLevel2Ctrl', function($scope,$rootScope,$state,$stateParams,$http,$location,$ionicPopup, $cordovaToast, $anchorScroll, RegionService, RegionListService, BreadCrumbService, $ionicHistory, PluginService,ListingStorageService) {

    $rootScope.toggleMenu = false;
    $scope.serverError = false;
    $scope.message = "";

	$scope.regionCode = localStorage.getItem('regionCode');
	$scope.subRegionLevel1Name = localStorage.getItem('subRegionLevel1Name');
	$scope.subRegionLevel1Code = localStorage.getItem('subRegionLevel1Code');


	$scope.swipBackUrl = $ionicHistory.backView();
	$scope.stop = false;


	$scope.toggleGroup = function(r) {
		if ($scope.isGroupShown(r)) {
	      $scope.shownGroup = null;
	    } else {
	      $scope.shownGroup = r;
	    }
	};

	$scope.isGroupShown = function(r) {
	    return $scope.shownGroup === r;
	};

	$scope.setSubRegionLevel2ScrollPosition = function(key){
		localStorage.setItem("lastSubRegionLevel2Position", key);
	}

	$scope.goToPostAnAd = function(){
		localStorage.setItem('goToPostAnAd', 'true');
		$state.go("poststep1");
	};
	
	/*
    	Function which enable swipe left
    */

	$scope.onSwipeLeft = function(direction){
		//TODO
	}


	/*
    	Function which enable swipe right
    */

	$scope.onSwipeRight = function(direction){
        if($scope.swipBackUrl != null && $scope.swipBackUrl != 'null'){
			$location.url($scope.swipBackUrl.url);
		}
	}


	if($stateParams.hasOwnProperty("region")){
		$scope.regionName =  $stateParams.regionName;
		localStorage.setItem('subRegionLevel2Name', $stateParams.regionName);
		localStorage.setItem('subRegionLevel2Code', $stateParams.region);

		if(localStorage.hasOwnProperty("lastSubRegionLevel2Position")){
			var key = localStorage.getItem("lastSubRegionLevel2Position");
			$location.hash(key);
			$anchorScroll();
		}

		var params = {	
						'level'         		: 'subRegionLevel2',
						'region' 				: $stateParams.region,
						'regionCode' 			: $scope.regionCode, 
						'regionName' 			: $scope.regionName,
						'subRegionLevel1Name' 	: $scope.subRegionLevel1Name,
						'subRegionLevel1Code' 	: $scope.subRegionLevel1Code,
						'subRegionLevel2Name' 	: $stateParams.regionName,
						'subRegionLevel2Code' 	: $stateParams.region
					 };


		var regionCategory = RegionService.getRegionData(params)
		regionCategory.then(function(response){
			$scope.stop = true;
			$scope.serverError = false;
			try{

				if(response && response.hasOwnProperty('data') && response.data.categories.length > 0 && response !== 'error'){
					var breadCrumb = BreadCrumbService.parseBreadCrumb(response.data.breadcrumb); 
					$scope.links = breadCrumb;
					$scope.message = "";
					$scope.regionCode =response.data.region_code;
					
					$scope.regions = response.data;
					//$scope.categoryList = response.data.categories;
					$scope.categoryList = _.filter(response.data.categories, function(data){ return (data.prefetch == "1") });

					
					var prefetchListingUrls = ListingStorageService.composePrefetchListingUrl($scope.categoryList,$scope.regionCode);
					var prefetchData = ListingStorageService.prefetchData(prefetchListingUrls,"region");
					localStorage.setItem("prefetchListingUrls",JSON.stringify(prefetchListingUrls));
					localStorage.setItem("previousUrls",JSON.stringify(prefetchListingUrls));
					localStorage.setItem('allCategories', JSON.stringify(response.data.categories));
					var regionObj = {'regionName' : $stateParams.regionName, 'regionCode' : $stateParams.region};
					$rootScope.$broadcast('allCategory',regionObj);
					$rootScope.$broadcast('breadCrumb', breadCrumb);

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
					//$state.go("errorPage");
				}else{
					$scope.serverError = true;
					$scope.message = response.message;
				}
			}
			catch(e){
				if(response.hasOwnProperty('message')){
					$scope.serverError = true;
					$scope.message = response.message;
				}
			}
		});
	}else{
		alert("please select region name");
	}

	/*
   		Function to Set selected category in local-storage
    */

	$scope.subRegionLevel3Category = function(s,sc){
		$rootScope.toggleMenu = false;
		localStorage.setItem('category', JSON.stringify({"title":s.title,"directory":s.directory, "category_id" : s.category_id}));
		if(sc != 'null'){
			localStorage.setItem('subCategory', JSON.stringify(sc));
		}else{
			localStorage.setItem('subCategory', 'null');
		}
	};

	$scope.subRegionLevel3 = function(s){
		
		$rootScope.toggleMenu = false;
		localStorage.setItem('subRegionLevel3', JSON.stringify(s));

		/* Feb 21 Issues #111*/
		localStorage.setItem('currentUserRegion', JSON.stringify(s));
	};
	
	$scope.gotoDirectory = function(q) {
		var regionId = $scope.regions.region_id;
		$location.url('directory?region='+$scope.regionCode+'&regionName='+$scope.regionName+'&directory=all&directoryName='+$scope.regionName+'&regionId='+regionId+'&q='+q);
	}

	$scope.updateBreadCrumb = function() {
		if(!$stateParams.hasOwnProperty("region")) return;
		var params = {	
			'level'         		: 'subRegionLevel2',
			'region' 				: $stateParams.region,
			'regionCode' 			: $scope.regionCode, 
			'regionName' 			: $scope.regionName,
			'subRegionLevel1Name' 	: $scope.subRegionLevel1Name,
			'subRegionLevel1Code' 	: $scope.subRegionLevel1Code,
			'subRegionLevel2Name' 	: $stateParams.regionName,
			'subRegionLevel2Code' 	: $stateParams.region
		};
		var regionCategory = RegionService.getRegionData(params)
		regionCategory.then(function(response){
			$scope.stop = true;
			$scope.serverError = false;
			try{
				if(response && response.hasOwnProperty('data') && response.data.categories.length > 0 && response !== 'error'){
					var breadCrumb = BreadCrumbService.parseBreadCrumb(response.data.breadcrumb); 
					$scope.links = breadCrumb;
					$rootScope.$broadcast('breadCrumb', breadCrumb);
				}
			} catch(e){
				if(response.hasOwnProperty('message')){
					$scope.serverError = true;
					$scope.message = response.message;
				}
			}
		});
	}

	$scope.$on( "$ionicView.enter", function( scopes, states ) {
		$scope.updateBreadCrumb();
    });	
});

