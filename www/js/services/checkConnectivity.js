'use strict';
angular.module('starter').factory('ConnectivityMonitor', function ($http, $q, $rootScope, $cordovaNetwork, $cordovaToast, ErrorService) {

  return {
    checkWiFiOnlineHard: function () {
      var deferred = $q.defer();
      var address = sessionStorage.getItem('address');
      var proxy = sessionStorage.getItem('proxy');
      var version = sessionStorage.getItem('version');
      var project_key = sessionStorage.getItem('project_key');
      var sessionData = JSON.parse(localStorage.getItem("sessionData"));

      if (ionic.Platform.isWebView()) {
        $http({
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'PROJECT_KEY': project_key,
            'ACCESS_KEY': sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : '',
            'API_KEY': sessionData !== null && sessionData.api_key !== undefined ? sessionData.api_key : ''
          },
          url: address + proxy + '/' + version + '/lookup/regionlist'
        }).success(function (result) {
          deferred.resolve(true);
        }).error(function (e, status, header) {
          if (status == 408) {
            deferred.resolve(false);
          } else {
            deferred.resolve(true);
          }
        });
      } else {
        deferred.resolve(navigator.onLine);
      }
      return deferred.promise;
    },

    offlineMessage: function(){
      if(typeof cordova !== 'undefined'){
        $cordovaToast
            .showShortCenter('You are offline, check your internet connection.')
            .then(function(success) {
              // success
            }, function (error) {
              // error
          });
      }
    },
    
    authenticationFailedMessage: function () {
      var errMessage = 'Authentication failed. You are logged out.';
      ErrorService.showErrorMessage(errMessage);
    },

    syncMessage: function () {
      var errMessage = 'Sync in progress.';
      ErrorService.showErrorMessage(errMessage);
    },

    clipBoardMessage: function(){
      if(typeof cordova != 'undefined'){
          $cordovaToast
            .showShortCenter('Email copied to clipboard.')
            .then(function(success) {
              // success
            }, function (error) {
              // error
          });
      }else{
        alert('Sync in progress.');
      }
        
    },

    offlineTextMessage: function () {
      $rootScope.networkMessage = 'Cannot reach expatriates.com. Please check your Internet connection.'
      return $rootScope.networkMessage
    },

    isOnline: function () {
      if (ionic.Platform.isWebView()) {
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }
    },

    isOffline: function () {
      if (ionic.Platform.isWebView()) {
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }
    },

    startWatching: function () {
      if (ionic.Platform.isWebView()) {
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
          $rootScope.onlineStatus = true;
        });

        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
          $rootScope.onlineStatus = false;
        });
      } else {
        window.addEventListener("online", function (e) {
          $rootScope.onlineStatus = true;
        }, false);

        window.addEventListener("offline", function (e) {
          $rootScope.onlineStatus = false;
        }, false);
      }
    }
  }
}).factory('timeoutHttpIntercept', function ($rootScope, $q) {
  return {
    'request': function (config) {
      config.timeout = 120000;
      return config;
    }
  };
});
