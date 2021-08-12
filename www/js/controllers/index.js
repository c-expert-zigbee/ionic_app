'use strict';

angular.module('starter')

  .controller('IndexCtrl', function ($scope, $rootScope, $state, $stateParams, $http, $location, $ionicPopup, $cordovaToast, $ionicHistory, $timeout, $ionicSideMenuDelegate, SessionService, HomeService, ConnectivityMonitor, ResponseValidation, AuthenticationService, PluginService, ListingStorageService, StorageService) {

    $scope.serverAddress = sessionStorage.getItem('address');
    $scope.activatedLink = sessionStorage.getItem('activatedLink');

    if (localStorage.getItem('allCategories') != 'undefined') {
      $scope.regionObj = JSON.parse(localStorage.getItem('currentSelectRegionObj'));
      $scope.allCategories = JSON.parse(localStorage.getItem('allCategories'));
    }

    $scope.toggleMenu = function () {
      if ($ionicSideMenuDelegate.isOpenLeft()) {
        $ionicSideMenuDelegate.toggleLeft(false);
      } else {
        $ionicSideMenuDelegate.toggleLeft(true);
      }
    }

    $scope.syncListingData = function () {
      if ($rootScope.onlineStatus) {
        if ($rootScope.isRefreshing === false) {
          ConnectivityMonitor.syncMessage();
          $rootScope.isRefreshing = true;
          StorageService.getAllListingUrls().then(function (result) {
            ListingStorageService.syncAdData(result, "listing");
          });
          StorageService.getAllRegionUrls().then(function (result) {
            ListingStorageService.syncRegionData(result, "region");
          });
        }
      } else {
        ConnectivityMonitor.offlineTextMessage();
      }
      // var dbListingUrls = ListingStorageService.composedbListingUrls();
    }

    var TimeOutTimerValue = 1000 * 60 * 15;
    var refreshingPromise;
    $rootScope.isRefreshing = false;
    $scope.startRefreshing = function () {
      if ($rootScope.isRefreshing) return;
      //$rootScope.isRefreshing = true;
      (function refreshEvery() {
        $scope.syncListingData();
        refreshingPromise = $timeout(refreshEvery, TimeOutTimerValue)
      }());
    };

    $timeout(function () {
      $scope.startRefreshing()
    }, TimeOutTimerValue);

    $scope.showSearchIcon = true;
    $scope.errorMessage = SessionService.getObject('errorObject');
    $scope.offlineMsg = ConnectivityMonitor.offlineTextMessage();
    $rootScope.toggleMenu = false;

    $scope.showMenuItem = function (type) {
      $rootScope.toggleMenu = !$rootScope.toggleMenu;
      $scope.activatedLink = type;
      sessionStorage.setItem('activatedLink', type);
      if (type == 'home') {
        localStorage.removeItem("subRegionLevel0");
        localStorage.removeItem("subRegionLevel1");
        localStorage.removeItem("subRegionLevel2");
        localStorage.removeItem("subRegionLevel3");
        $state.go('home');
      }
    };

    $scope.goToPostAnAd = function () {
      $state.go("poststep1");
    };

    $scope.$on('logout', function (event, args) {
      $rootScope.sessionData = localStorage.getItem("sessionData");
      localStorage.removeItem('currentUserRegion');
    });

    $scope.$on('allCategory', function (event, args) {
      if (localStorage.getItem('allCategories') != 'undefined') {
        $scope.regionObj = args;
        localStorage.setItem('currentSelectRegionObj', JSON.stringify(args));
        $scope.allCategories = JSON.parse(localStorage.getItem('allCategories'));
      }
    });

    $scope.$on('breadCrumb', function (event, args) {
      $scope.breadCrumb = args;
    });

    $scope.logOut = function () {
      if ($rootScope.onlineStatus) {
        if (ResponseValidation.logout()) {
          if (typeof cordova !== 'undefined') {
            $cordovaToast.showLongCenter('You have been succesfully logged out.')
              .then(function (success) {
                // success
              }, function (error) {
                // error
              });
          } else {
            alert("You have been succesfully logged out.");
          }
          $state.go('home');
        }
      } else {
        ConnectivityMonitor.offlineMessage();
      }
    };

    $scope.goToErrorPage = function () {
      $rootScope.toggleMenu = false;
      $ionicHistory.clearCache().then(function () {
        $ionicHistory.goBack();
      });
    }

    $scope.contactus = function () {
      if ($rootScope.onlineStatus) {
        var URL = 'http://expatriates.com/html/contactus.html';
        window.open(URL, '_system', 'location=yes');
      } else {
        ConnectivityMonitor.offlineMessage();
      }
    };

    $scope.isAuthenticated = function () {
      return AuthenticationService.isLogged();
    }

    document.addEventListener('deviceready', function (e) {
      // Handle the event...
      if (typeof cordova != 'undefined') {
        PluginService.AdMobService(0, false);
      }
    });

    $scope.subRegionLevelCategory = function (s, sc) {
      localStorage.setItem('selectedtitle', s.title);
      $rootScope.toggleMenu = false;
      localStorage.setItem('category', JSON.stringify({
        "title": s.title,
        "directory": s.directory,
        "category_id": s.category_id
      }));
      if (sc != 'null') {
        localStorage.setItem('subCategory', JSON.stringify(sc));
      } else {
        localStorage.setItem('subCategory', 'null');
      }
    };

    $scope.goToMyAds = function () {
      $state.go("myAds");
    };

    $scope.goToProfile = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go("profile");
      });
    };

    $scope.exitApp = function () {
      ionic.Platform.exitApp();
    }

  });
