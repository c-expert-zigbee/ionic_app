'use strict';

angular.module('starter')
 
.controller('SubCityCtrl', function($scope,$rootScope,$state,$stateParams,$http,$location,$ionicPopup, $cordovaToast, RegionService, RegionListService, BreadCrumbService) {

	/*==============================================================================
    					Function to display country list , Get city list  and 
    					store data in local-storage		
    ================================================================================*/

    $rootScope.toggleMenu = false;
    $scope.countryName = localStorage.getItem('countryName');
    $scope.countryCode = localStorage.getItem('countryCode');
    $scope.cityName = localStorage.getItem('cityName');
    $scope.cityCode = localStorage.getItem('cityCode');


	if($stateParams.hasOwnProperty("region")){

		$scope.subCityName =  $stateParams.regionName;
		$scope.subCityCode =  $stateParams.region;
		localStorage.setItem('subCityName',$stateParams.regionName);
		localStorage.setItem('subCityCode',$stateParams.region);
		var params = {	'region' 		: $stateParams.region, 
						'countryName' 	: $scope.countryName,
						'countryCode' 	: $scope.countryCode,
						'cityName' 		: $scope.cityName,
						'cityCode' 		: $scope.cityCode,
						'subCityName'   : $scope.subCityName,
						'subCityCode'   : $scope.subCityCode
					 };

		var breadCrumb = BreadCrumbService.getBreadCrumb(params);
		$scope.links = breadCrumb;


		var regionCategory = RegionService.getRegionsCategory(params)
		regionCategory.then(function(response){
			try{
				if(response && response.hasOwnProperty('data') && response.data.categories.length > 0 && response !== 'error'){
					$scope.currentRegion = response.data.region;
					$scope.regionCategory = response.data.categories
					if(angular.isDefined(response.data.subregions)){
						$scope.subRegions = response.data.subregions
					}
					$scope.stop = true;
				}else if(response === 'error'){
					$scope.stop = true;
					$state.go("errorPage");
				}else{
					$scope.stop = true;
				}
			}
			catch(e){
			}
		});
	}else{
		alert("please select region name");
	}

		/*====================================================================================
    			= 		Function to convert string number in Int number for OrderBy		=
    =========================================================================================*/


	$scope.orderByFunction = function(category){
		$rootScope.toggleMenu = false;
		return parseInt(category.category_id);
	}

	/*==============================================================================
    			= 		Function to Set selected category in local-storage 		=
    ================================================================================*/

	$scope.setCategoryTitle = function(s,sc){
		$rootScope.toggleMenu = false;
		localStorage.setItem('directory', JSON.stringify({"title":s.title,"directory":s.directory}));
		if(sc != 'null'){
			localStorage.setItem('subDirectory', JSON.stringify(sc));
		}else{
			localStorage.setItem('subDirectory', 'null');
		}
	};
});

