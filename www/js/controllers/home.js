'use strict';

angular.module('starter')

.controller('HomeCtrl', function($timeout, $scope, $rootScope, $state, $http,  $location, $ionicHistory, $ionicPopup, $cordovaToast, $q, HomeService,RegionService, ResponseValidation, PluginService, ListingStorageService, ConnectivityMonitor, SessionService) {

	/*
    	Variables Initialization
   */
   	$scope.serverError = false;
	$scope.stop = false;
	$rootScope.toggleMenu = false;
	$scope.showData = false;
	$scope.firstEntry = true;
	$rootScope.sessionData = localStorage.getItem("sessionData");
	/*
    	Removing localstorage data
   */

	localStorage.removeItem('parseBreadCrumb');
	localStorage.removeItem('subDirectory');
	localStorage.removeItem('directory');
	
	/*
    	Logout method which is also clearing localstorage.
    */

	$scope.$on('logout', function(event, args) {
		localStorage.removeItem('authenticated');
		localStorage.removeItem('currentUserRegion');
		$rootScope.sessionData =  localStorage.getItem("sessionData");
	});


	$scope.goToPostAnAd = function(){
		localStorage.setItem('goToPostAnAd', 'true');
		$state.go("poststep1");
	};


	/*
		Store current region of a user which can be use on step 2 of 3 for place an ad 
	*/
	/* Feb 21 Issues #111*/

	$scope.currentRegion = function(r){
		localStorage.setItem('subRegionLevel0', JSON.stringify(r));
		localStorage.setItem('currentUserRegion', JSON.stringify(r));
	};

	/*
    	Function to store current directory and subDirectory data which will 
    	be used in comming page.
    */

	$scope.subRegionLevel1Category = function(s,sc){
		$rootScope.toggleMenu = false;
		localStorage.setItem('category', JSON.stringify({"title":s.title,"directory":s.directory}));
		if(sc != 'null'){
			localStorage.setItem('subCategory', JSON.stringify(sc));
		}else{
			localStorage.setItem('subCategory', 'null');
		}
		$location.url('directory?region='+$scope.regionCode+'&directory='+s.directory+'&directoryName='+s.title+'&type=country');
	};
	
	/*
   		* if given group is the selected group, deselect it
   		* else, select the given group
   	*/
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

	/*
    	Function to get all highlight region list.
    */
	
	$scope.getHighlightRegionlist = function(){
		var regionHighlight = HomeService.getRegionHighlightList();
		regionHighlight.then(function(response){
			$scope.serverError = false;
			try {
				$scope.firstEntry = false;
				if (response && response.hasOwnProperty('data') && response !== 'error') {
					$scope.highlightRegionList = response.data.region;
					localStorage.setItem('highlightRegions', JSON.stringify($scope.highlightRegionList));
				} else {
					$scope.serverError = true;
					$scope.message = response.message;
				}
			} catch(e) {
				if (response.hasOwnProperty('message')) {
					$scope.serverError = true;
					$scope.message = response.message;
				}
				if (typeof cordova != "undefined") {
					$cordovaToast.show('Check your internet connection.', 'long', 'center')
					.then(function(success) {}, function (error) {});
				}
			}
		});
	};

	/*
    	Function to get all region list.
    */

	$scope.getAllRegionlist = function(){
		var region = HomeService.getRegionlist();
		region.then(function(response){
			$scope.serverError = false;
			try{
				$scope.firstEntry = false;
				if(response && response.hasOwnProperty('data') && response !== 'error'){
					$scope.stop = true;
					$scope.regionList = response.data.regions;
					localStorage.setItem('regions', JSON.stringify($scope.regionList));
					/*if(navigator && navigator.splashscreen){
			      		navigator.splashscreen.hide();
			      	} */
				}else{
					/*if(navigator && navigator.splashscreen){
			      		navigator.splashscreen.hide();
			      	} */
					//$scope.stop = true;
					//$state.go("errorPage");
					$scope.serverError = true;
					$scope.message = response.message;
				}
			}
			catch(e){
				if(response.hasOwnProperty('message')){
					$scope.serverError = true;
					$scope.message = response.message;
				}
				if(typeof cordova != "undefined"){
					$cordovaToast.show('Check your internet connection.', 'long', 'center')
					.then(function(success) {}, function (error) {});
				}
			}
		});
    };
	    	
    /*
    	Function to get all category list and prefetch all listing Ads urls of respective region and category
    */

    $scope.getAllCategorylist = function(){
    	var allCategory = HomeService.getAllCategoryList();
		allCategory.then(function(response){
			try{
				$scope.firstEntry = false;
				if(response && response.hasOwnProperty('data') && response !== 'error'){
					$scope.allCategories = response.data.categories;

					$scope.categoryListHighlightRegions = _.filter(response.data.categories, function(data){ return (data.prefetch == "1") });
					var highLightRegionListingUrls = ListingStorageService.highLightRegionPrefetchListingUrl($scope.categoryListHighlightRegions,$scope.highlightRegionList);
					var prefetchData = ListingStorageService.prefetchData(highLightRegionListingUrls,"region");
					
					localStorage.setItem('allCategories', JSON.stringify($scope.allCategories));
					var regionObj = {'regionName' :'International'};
					$rootScope.$broadcast('allCategory', regionObj);
					$rootScope.$broadcast('breadCrumb', ["<a class='slide-menu-font' href='#/home'>International</a>"]);
				}else{
					//$scope.stop = true;
					//$state.go("errorPage");
				}
			}
			catch(e){
				if(typeof cordova != "undefined"){
					$cordovaToast.show('Check your internet connection.', 'long', 'center')
					.then(function(success) {}, function (error) {});
				}
			}
		});
	};

	/*
    	Function to get list of region based on selection
    */

	$scope.getRegionData = function(c){
		$rootScope.toggleMenu = false;
		localStorage.setItem('selectedRegion', JSON.stringify(c));

		/* Feb 21 Issues #111*/
		localStorage.setItem('currentUserRegion', JSON.stringify(c));

		$location.url('/region?region='+c.region_code+'&regionName='+c.name);
	}

	$scope.gotoDirectory = function(q) {
		var directoryName = '<img class="header-image" src="./img/favicon.png" /> expatriates.com';
		$location.url('directory?directory=all&directoryName='+directoryName+'&q='+q);
	}
	/* 18 feb 2017 : #470 : Hiding AdBanner */
	/* 21 feb 2017 : #112  admob should only appear on region, listing and posting pages.*/

	document.addEventListener('deviceready', function(e){
      // Handle the event...
      if(typeof cordova != 'undefined'){
      		PluginService.AdMobService(0, false);
      }
    });

    $rootScope.$on('$ionicView.loaded', function(event,data) {
	    setTimeout(function() {
	    	if($state.current.name == 'home' && !localStorage.hasOwnProperty('regions')){
		    	$scope.getHighlightRegionlist();
				$scope.getAllRegionlist();
				$scope.getAllCategorylist();
		    }
	    }, 1000);
	});
    
    if($state.current.name == 'home'){
    	$scope.getHighlightRegionlist();
		$scope.getAllRegionlist();
		$scope.getAllCategorylist();
    }

//Directive to show the default image, if user image is null.
}).directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})
