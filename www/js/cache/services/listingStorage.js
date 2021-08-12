
'use strict';
angular.module('starter').service('ListingStorageService', function($rootScope, $q, $timeout, $ionicHistory, DirectoryService, StorageService, HomeService, RegionService) {

	
	/*
		method to save prefetched  listing data in localStorage [currently not in use 06-02-2017]
	*/

	function savelistingData(prefetchUrl){
		var params = {url : prefetchUrl};
		$ionicHistory.clearCache().then(function(){
			DirectoryService.getDirectories(params);
		});
	};



	/*
		method to save prefetched listing data at sync in localStorage [currently not in use 06-02-2017]
	*/

	function savelistingDataAtSyns(prefetchUrl){
		var params = {url : prefetchUrl};
		$ionicHistory.clearCache().then(function(){
			DirectoryService.getDirectoriesForSync(params);
		})
	};

	/*
		method to get listing Url's which is store in local db [currently not in use 06-02-2017]
	*/

	this.composedbListingUrls = function(){
		var dbListingUrls = [];
		StorageService.getAllListingUrls().then(function(result){
			if(result && result.rows && result.rows.length > 0){
				angular.forEach(result.rows, function(val, key) {
					(function (key) {
						   dbListingUrls.push(val.queryUrl);
					}).call(this, key);
				});
			}else{
				//TODO
			}
		});
		return dbListingUrls;
	}	


	/*
		method to create prefetch Url's for highlight region listing with region code
	*/

	this.highLightRegionPrefetchListingUrl = function(categoryList,regions){
		var highLightRegionListingUrls = [];
		angular.forEach(regions, function(val) {
			angular.forEach(categoryList, function(data, key) {
				var categoryUrl = '/eapi/v1/listing/'+val.region_code+'/'+data.directory;
				highLightRegionListingUrls.push(categoryUrl);
			});
		});
		return highLightRegionListingUrls;
	};

	/*
		method to create prefetch Url's for listing with region code
	*/

	this.composePrefetchListingUrl = function(categoryList,regionCode){
		var prefetchListingUrls = [];
		angular.forEach(categoryList, function(val, key) {
			var url = '/eapi/v1/listing/'+regionCode+'/'+val.directory;
			var prefetchListingUrl = url.toString();
			prefetchListingUrls.push(prefetchListingUrl);
			angular.forEach(val.subcategories, function(data, key) {
				var subcategoryUrl = '/eapi/v1/listing/'+regionCode+'/'+data.directory;
				var prefetchSubcategoryUrl = subcategoryUrl.toString();
				prefetchListingUrls.push(prefetchSubcategoryUrl);
			});
		});
	      
		return prefetchListingUrls;
				
	};

	/*
		method to refresh Data of listing page at sync
	*/
	this.syncAdData = function(prefetchUrlsSQLiteRows,page){
		var arr = [];
		for(var i = 0; i < prefetchUrlsSQLiteRows.rows.length; i++){
			(function (i) {
                if(i < prefetchUrlsSQLiteRows.rows.length){
                        $timeout(function(){
                        	var params = {url :prefetchUrlsSQLiteRows.rows.item(i).queryUrl};
                            arr.push(DirectoryService.getDirectoriesForSync(params));
                            //savelistingDataAtSyns(prefetchUrlsSQLiteRows.rows.item(i).queryUrl);
                        },(i+1)*5000);
                 }
            }).call(this, i);
		}

		$q.all(arr).then(function (ret) {
			$rootScope.isRefreshing = false;
		});
	};

	/*
		method to refresh Data of region page at sync
	*/
	this.syncRegionData = function(prefetchUrlsSQLiteRows,page){
		var address = sessionStorage.getItem('address');
		var arr = [];
		for(var i = 0; i < prefetchUrlsSQLiteRows.rows.length; i++){
			(function (i) {
                if(i < prefetchUrlsSQLiteRows.rows.length){
                        $timeout(function(){
                        	if(address+'/eapi/v1/classifieds/all/category' == prefetchUrlsSQLiteRows.rows.item(i).queryUrl){
                        		arr.push(HomeService.getAllCategoryListAtSync());
                        	}else if(address+'/eapi/v1/lookup/regionhighlight' == prefetchUrlsSQLiteRows.rows.item(i).queryUrl){
                        		arr.push(HomeService.getRegionHighlightListAtSync());
                        	}else if(address+'/eapi/v1/lookup/regionlist' == prefetchUrlsSQLiteRows.rows.item(i).queryUrl){
                        		arr.push(HomeService.getRegionlistAtSync());
                        	}else{
                        		arr.push(RegionService.getRegionDataAtSync(prefetchUrlsSQLiteRows.rows.item(i).queryUrl));
                        	}
                            //savelistingDataAtSyns(prefetchUrlsSQLiteRows.rows.item(i).queryUrl);
                        },(i+1)*5000);
                 }
            }).call(this, i);
		}
		
		$q.all(arr).then(function (ret) {
			$rootScope.isRefreshing = false;
		});
	};


	/*
		method to prefetch Data for listing page from region subregionlevel1 and subregionlevel2
	*/
	this.prefetchData = function(prefetchUrls,page){
		var arr = [];
		for(var i = 0; i < prefetchUrls.length; i++){
			(function (i) {
                if(i < prefetchUrls.length){
                        $timeout(function(){
                            //savelistingData(prefetchUrls[i])
                            var params = {url : prefetchUrls[i]};
                            arr.push(DirectoryService.prefetchDirectories(params));
                        },(i+1)*5000);
                 }
            }).call(this, i);
		}
		$q.all(arr).then(function (ret) {
			$rootScope.isRefreshing = false;
		});
	};
	
});
