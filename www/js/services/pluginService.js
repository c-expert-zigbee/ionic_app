'use strict';
angular.module('starter').factory('PluginService', function($http,$q, $rootScope, $cordovaNetwork, $cordovaToast, $ionicPopup){
	return {
		dialogBox : function (title, message){
	        var myPopup = $ionicPopup.show({
	          	subTitle: message,
	          	title: title,
	          	scope: $rootScope
	        });
	        return myPopup
	    },

	    AdMobService : function(show_adsense , flag){
	    	
	    	/* 18 feb 2017 : #470 : Hiding AdBanner */
	    	/* 21 feb 2017 : #112  admob should only appear on region, listing and posting pages.*/
	    	if(ionic.Platform.isAndroid())  { 
				document.addEventListener('deviceready', function(e){
			      	// Handle the event...
			      	if(AdMob && show_adsense == 1 && flag){
				    	AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
				    }else{
				    	AdMob.hideBanner();
				    }
			    });
			}
	    }
  	}
});