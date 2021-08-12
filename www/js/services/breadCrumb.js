'use strict'; 

angular.module('starter').service('BreadCrumbService', function( $rootScope ,$http, $q, ConnectivityMonitor) {		

	this.parseBreadCrumb = function(queryJson){
		if(localStorage.getItem("lastPos")){
        	localStorage.removeItem("lastPos");
        }
        if(localStorage.getItem("lastSerPos")){
        	localStorage.removeItem("lastSerPos");
        }
        $rootScope.regionCodeList = [];
	    $rootScope.regionNameList = [];
		$rootScope.regionLinks = [];
		$rootScope.regionCodeList = [];
		$rootScope.regionNameList = [];

		$rootScope.regionLinksForDirectory = [];
		$rootScope.regionLinksForDirectory = [

		];
		$rootScope.regionLinks = [

	    ];
	    var query = queryJson.toString(); 
	    var splitData = query.split(';');

	    splitData.splice(-1,1);

	    angular.forEach(splitData, function(value, key) {
	    	var splitDataInner = value.split(',');

	    	$rootScope.regionCodeList.push(splitDataInner[1]);
			$rootScope.regionNameList.push(splitDataInner[0]);
			if(splitData.length > 1 && key >= 1){
				var url = encodeURI("#/region?region="+splitDataInner[1]+"&regionName="+splitDataInner[0]);
	    		$rootScope.regionLinks.push("<a class='slide-menu-font' href="+url+">"+splitDataInner[0]+"</a>");
	    		$rootScope.regionLinksForDirectory.push("<a class='slide-menu-font' href="+url+">"+splitDataInner[0]+"</a>");
			}	    	
	    });
	    localStorage.setItem('parseBreadCrumb', JSON.stringify($rootScope.regionLinksForDirectory));
	    localStorage.setItem('regionCodeList', JSON.stringify($rootScope.regionCodeList));
	    localStorage.setItem('regionNameList', JSON.stringify($rootScope.regionNameList));
	    return $rootScope.regionLinks
	}


});

