'use strict';

angular.module('starter')

.controller('RegionCtrl', function($scope,$rootScope,$state,$stateParams,$http,$location,$ionicPopup, $cordovaToast, $anchorScroll, RegionService, BreadCrumbService,$ionicHistory, PluginService,ListingStorageService, ConnectivityMonitor) {

	$scope.serverError = false;
	$scope.message = "";

	if($ionicHistory){
		$scope.swipBackUrl = $ionicHistory.backView();
	}

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

	$scope.setRegionScrollPosition = function(key){
		localStorage.setItem("lastRegionPosition", key);
	}

	$scope.goToPostAnAd = function(){
		localStorage.setItem('goToPostAnAd', 'true');
		$state.go("poststep1");
	};
	
	$scope.getRegionData = function() {
		if(!$stateParams.hasOwnProperty("region")) return;
		var params ={
			'level'         : 'region',
			'region' 		: $stateParams.region,
			'regionCode' 	: $stateParams.region,
			'regionName' 	: $stateParams.regionName
		};

		var regionData = RegionService.getRegionData(params);
		regionData.then(function(response){
			$scope.stop = true;
			$scope.serverError = false;
			try {
				if(response && response.hasOwnProperty('data') && response.data.categories.length > 0 && response !== 'error'){
					$scope.message = "";
					var breadCrumb = BreadCrumbService.parseBreadCrumb(response.data.breadcrumb);
					$scope.links = breadCrumb;

					$scope.regionCode =response.data.region_code;
					$scope.regions = response.data;
					$scope.categoryList = _.filter(response.data.categories, function(data){ return (data.prefetch == "1") });

					var prefetchListingUrls = ListingStorageService.composePrefetchListingUrl($scope.categoryList,$scope.regionCode);
					var prefetchData = ListingStorageService.prefetchData(prefetchListingUrls,"region");
					localStorage.setItem("prefetchListingUrls",JSON.stringify(prefetchListingUrls));
					localStorage.setItem('allCategories', JSON.stringify(response.data.categories));
					var regionObj = {'regionName' : $stateParams.regionName, 'regionCode' : $stateParams.region};
					$rootScope.$broadcast('allCategory', regionObj);
					$rootScope.$broadcast('breadCrumb', breadCrumb);

					if(typeof cordova !== 'undefined'){
						if(response.data.show_adsense == 1){
							PluginService.AdMobService(response.data.show_adsense, true);
						}else{
							PluginService.AdMobService(response.data.show_adsense, false);
						}
					}
				}else if(response === 'error'){
					//$state.go("errorPage");
					//ConnectivityMonitor.offlineMessage();
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
	}
	/*
    	Function to display country list , Get city list  and 
    	store data in local-storage		
    */

    $scope.stop = false;
    $rootScope.toggleMenu = false;

	if($stateParams.hasOwnProperty("region")){
		$scope.regionName = $stateParams.regionName;
		localStorage.setItem('regionName', $stateParams.regionName);
		localStorage.setItem('regionCode', $stateParams.region);

		/*
    		Removing localstorage data
    	*/

		localStorage.removeItem('subRegionLevel1Name');
		localStorage.removeItem('subRegionLevel2Name');
		localStorage.removeItem('subRegionLevel1Code');
		localStorage.removeItem('subRegionLevel2Code');
		localStorage.removeItem('parseBreadCrumb');

		/*
    		Removing localstorage data conditionally like from which page its 
			return back 
    	*/

		if($scope.swipBackUrl != 'null' && $scope.swipBackUrl != null && $scope.swipBackUrl.stateName !== "cls/:pId/:region"){
			localStorage.removeItem('subDirectory');
			localStorage.removeItem('directory')
		}

		if(localStorage.hasOwnProperty("lastRegionPosition")){
			var key = localStorage.getItem("lastRegionPosition");
			$location.hash(key);
			$anchorScroll();
		}
		$scope.getRegionData();
	}else{
		alert("please select subregion name");
	}

	/*
    	Function to Set selected category in local-storage
    */

	$scope.selectedtitle = localStorage.getItem('selectedtitle');
	$scope.subRegionLevel1Category = function(s,sc){
		localStorage.setItem('selectedtitle',s.title);
		$rootScope.toggleMenu = false;
		localStorage.setItem('category', JSON.stringify({"title":s.title,"directory":s.directory, "category_id" : s.category_id}));
		if(sc != 'null'){
			localStorage.setItem('subCategory', JSON.stringify(sc));
		}
		else{
			localStorage.setItem('subCategory', 'null');
		}
	};

	$scope.subRegionLevel1 = function(s){
		$rootScope.toggleMenu = false;
		localStorage.setItem('subRegionLevel1', JSON.stringify(s));
		localStorage.setItem('currentUserRegion', JSON.stringify(s));
	}
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
        	$location.url($scope.swipBackUrl.url)
        }
	}
	
	$scope.gotoDirectory = function(q) {
		var regionId = $scope.regions.region_id;
		$location.url('directory?region='+$scope.regionCode+'&regionName='+$scope.regionName+'&directory=all&directoryName='+$scope.regionName+'&regionId='+regionId+'&q='+q);
	}

    $scope.$on( "$ionicView.enter", function( scopes, states ) {
		$scope.getRegionData();
    });
});

