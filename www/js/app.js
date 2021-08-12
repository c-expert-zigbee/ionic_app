'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic-material', 'ngCordova', 'ion-gallery', 'angular.filter', 'ngFileUpload', 'ngMessages', 'ion-autocomplete', 'angularMoment', 'ng-slide-down'])
  .run(function ($ionicPlatform, $http, $rootScope, $state, $location, $ionicHistory, ConnectivityMonitor, $cordovaNetwork, ResponseValidation, SqlService, WebsqlDB, $ionicPopup) {

    $rootScope.onlineStatus = true;

    $ionicPlatform.registerBackButtonAction(function (event) {
      if ($state.current.name != "home") {
        localStorage.setItem("hardware-back", "true");
        if ($ionicHistory.backView() && $rootScope.onlineStatus) {
          $ionicHistory.goBack();
        } else {
          $state.transitionTo("home", {
            location: true,
            reload: true,
            inherit: true,
            notify: true
          });
        }
      } else {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Exit <b>expatriates.com</b>',
          template: 'Are you sure you want to exit?',
          cssClass: 'exit-popup'
        });
        confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          } else {
            console.log('Not sure!');
          }
        });
      }
    }, 100);

    $ionicPlatform.ready(function () {
      //start watching online and offline status
      ConnectivityMonitor.startWatching();

      if (ionic.Platform.isAndroid()) {

        // Status bar Andriod 5+
        //StatusBar.backgroundColorByHexString("#3483db");
        if (window.StatusBar) {
          // Set the statusbar to use the default style, tweak this to
          // remove the status bar on iOS or change it to use white instead of dark colors.
          //StatusBar.styleDefault();
          StatusBar.backgroundColorByHexString("#006699");
        }
        var admobid = { // for Android
          banner: 'ca-app-pub-8969232830755522/5252312487' // Change this to your Ad Unit Id for banner...
        };

        if (typeof cordova != 'undefined' && AdMob) {
          AdMob.createBanner({
            adId: admobid.banner,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            autoShow: false
          });
        }

        if (typeof analytics !== 'undefined' && analytics) {
          analytics.startTrackerWithId("UA-94230-5");
        }

        $rootScope.$on('$stateChangeSuccess', function () {
          var currentUrl = $location.url();
          if (typeof analytics !== 'undefined' && analytics) {
            analytics.startTrackerWithId("UA-94230-5");
            analytics.trackView(currentUrl);
          }
        });
      }

      document.addEventListener("pause", onPause, false);

      function onPause() {
        // Handle the pause event
      }

      document.addEventListener("resume", onResume, false);

      function onResume() {
        // Handle the pause event
      }

      document.addEventListener("deviceready", onDeviceReady, false);

      function onDeviceReady() {
        // Now safe to use device APIs
      }

      document.addEventListener('deviceready', function (e) {
        // Handle the event...
        if (typeof cordova != 'undefined' && ionic.Platform.isAndroid()) {
          if (AdMob) {
            AdMob.hideBanner();
          }
        }
      });

      WebsqlDB.initDB();

    });
  }).config(function ($stateProvider, $httpProvider, $urlRouterProvider, $animateProvider, $ionicConfigProvider, ionGalleryConfigProvider) {
    ionGalleryConfigProvider.setGalleryConfig({
      action_label: 'Close'
    });
    $animateProvider.classNameFilter(/\bangular-animated\b/);
    /*window.navigator.__defineGetter__('userAgent', function () {
      return 'Expatriates Ionic App / 1.0';
    });*/
    //$httpProvider.defaults.headers = {'User-Agent' : 'Expatriates Ionic App / 1.0'};
    $httpProvider.interceptors.push('timeoutHttpIntercept');
    $httpProvider.defaults.headers.common = {
      'product': 'Expatriates Ionic App',
      'product-version': '1.0'
    };
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.transition('none');
    //$ionicConfigProvider.views.maxCache(0);
    //$ionicConfigProvider.views.swipeBackEnabled(true);
    $ionicConfigProvider.views.forwardCache(false);
    $ionicConfigProvider.backButton.previousTitleText(false).text('&emsp;&emsp;');

    if (ionic.Platform.isAndroid()) {
      $ionicConfigProvider.scrolling.jsScrolling(false);
    }

    moment.locale('en', {
      relativeTime: {
        future: "seconds ago",
        past: "%s ago",
        s: "seconds",
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "1d",
        dd: "%dd",
        M: "1m",
        MM: "%dm",
        y: "1y",
        yy: "%dy",
      }
    });

    var originalHumanize = moment.duration.fn.humanize;
    moment.duration.fn.humanize = function () {
      var days = Math.abs(this.asDays());
      if (days >= 1) {
        return Math.ceil(days) + 'd';
      }
      return originalHumanize.apply(this, arguments);
    };

    var checkData = function ($q, $timeout, $http, $location, $rootScope, $state, RegionService, ConfigService) {
      // Check if the user is not connected
      // Initialize a new promise
      var deferred = $q.defer();
      ConfigService.getConfig().then(function (data) {
        //localStorage.clear();
        sessionStorage.setItem('address', data.address);
        sessionStorage.setItem('proxy', data.proxy);
        sessionStorage.setItem('version', data.version);
        sessionStorage.setItem('project_key', data.project_key);
        if (localStorage.hasOwnProperty("hardware-back")) {
          $timeout(deferred.resolve);
          localStorage.removeItem("hardware-back");
        } else if (localStorage.hasOwnProperty('listingAdUrl')) {
          var listingAdUrl = JSON.parse(localStorage.getItem("listingAdUrl"));
          if (listingAdUrl.hasOwnProperty('region') && listingAdUrl.region != "undefined" && listingAdUrl.region != undefined && listingAdUrl.region != null && listingAdUrl.region != "") {
            $location.url("/directory?region=" + listingAdUrl.region + "&regionName=" + listingAdUrl.regionName + "&directory=" + listingAdUrl.directory + "&directoryName=" + listingAdUrl.directoryName);
          } else {
            $location.url("/directory?region=&regionName=&directory=" + listingAdUrl.directory + "&directoryName=" + listingAdUrl.directoryName);
          }
        } else if (localStorage.hasOwnProperty('subRegionLevel3')) {
          var regionLabel3 = JSON.parse(localStorage.getItem("subRegionLevel3"));
          $timeout(deferred.reject);
          $location.url('/subRegionLevel2?region=' + regionLabel3.region_code + '&regionName=' + regionLabel3.name);
          localStorage.removeItem('listingAdUrl');
        } else if (localStorage.hasOwnProperty('subRegionLevel2')) {
          var regionLabel2 = JSON.parse(localStorage.getItem("subRegionLevel2"));
          $timeout(deferred.reject);
          $location.url('/subRegionLevel1?region=' + regionLabel2.region_code + '&regionName=' + regionLabel2.name);
          localStorage.removeItem("subRegionLevel3");
          localStorage.removeItem('listingAdUrl');
        } else if (localStorage.hasOwnProperty('subRegionLevel1')) {
          var regionLabel1 = JSON.parse(localStorage.getItem("subRegionLevel1"));
          $timeout(deferred.reject);
          $location.url('/region?region=' + regionLabel1.region_code + '&regionName=' + regionLabel1.name);
          localStorage.removeItem("subRegionLevel2");
          localStorage.removeItem("subRegionLevel3");
          localStorage.removeItem('listingAdUrl');
        } else if (localStorage.hasOwnProperty('subRegionLevel0')) {
          var regionLabel0 = JSON.parse(localStorage.getItem("subRegionLevel0"));
          $timeout(deferred.reject);
          $location.url('/region?region=' + regionLabel0.region_code + '&regionName=' + regionLabel0.name);
          localStorage.removeItem("subRegionLevel1");
          localStorage.removeItem("subRegionLevel2");
          localStorage.removeItem("subRegionLevel3");
          localStorage.removeItem('listingAdUrl');
        } else {
          $timeout(deferred.resolve);
        }
      });
      return deferred.promise;
    };

    var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope, $state, ConnectivityMonitor) {
      var deferred = $q.defer();
      if (localStorage.getItem("sessionData")) {
        $rootScope.sessionData = JSON.parse(localStorage.getItem("sessionData"));
        if ($rootScope.sessionData != null && $rootScope.sessionData.hasOwnProperty('access_key')) {
          if (!$rootScope.onlineStatus) {
            $timeout(deferred.reject);
            ConnectivityMonitor.offlineMessage();
          } else {
            $timeout(deferred.resolve);
          }
        } else {
          $timeout(deferred.reject);
          $location.url('/signIn');
        }
      } else {
        $timeout(deferred.reject);
        $location.url('/signIn');
      }
      return deferred.promise;
    }

    var checkLogOut = function ($q, $timeout, $http, $location, $rootScope, $state, ConnectivityMonitor) {
      var deferred = $q.defer();
      $rootScope.sessionData = JSON.parse(localStorage.getItem("sessionData"));
      if ($rootScope.sessionData != null && $rootScope.sessionData.hasOwnProperty('access_key')) {
        $timeout(deferred.reject);
      } else {
        if (!$rootScope.onlineStatus) {
          $timeout(deferred.reject);
          ConnectivityMonitor.offlineMessage();
        } else {
          $timeout(deferred.resolve);
        }
      }
      return deferred.promise;
    }

    var checkOnlineStatusAndRegionData = function ($q, $stateParams, $timeout, $http, $location, $rootScope, $state, ConnectivityMonitor, StorageService) {
      var deferred = $q.defer();
      var address = sessionStorage.getItem('address');
      var proxy = sessionStorage.getItem('proxy');
      var version = sessionStorage.getItem('version');
      if (!$rootScope.onlineStatus) {
        if ($stateParams.hasOwnProperty('region')) {
          var queryUrl = address + proxy + '/' + version + '/classifieds/' + $stateParams.region;
          StorageService.getRegion(queryUrl).then(function (result) {
            if (result && result.rows && result.rows.length > 0) {
              $timeout(deferred.resolve);
            } else {
              $timeout(deferred.reject);
              ConnectivityMonitor.offlineMessage();
            }
          });
        }
      } else {
        angular.forEach($http.pendingRequests, function (request, index) {
          if (request.cancel) {
            request.cancel.resolve();
          }
        });
        $timeout(deferred.resolve);
      }
      return deferred.promise;
    }

    var checkOnlineStatusAndListingData = function ($q, $stateParams, $timeout, $http, $location, $rootScope, $state, ConnectivityMonitor, StorageService) {
      var deferred = $q.defer();
      if (!$rootScope.onlineStatus) {
        if ($stateParams.hasOwnProperty('region') && $stateParams.hasOwnProperty('directory')) {
          var queryUrl = "/eapi/v1/listing/" + $stateParams.region + "/" + $stateParams.directory;
          StorageService.getListing(queryUrl).then(function (result) {
            if (result && result.rows && result.rows.length > 0) {
              $timeout(deferred.resolve);
            } else {
              $timeout(deferred.reject);
              ConnectivityMonitor.offlineMessage();
            }
          });
        }
      } else {
        $timeout(deferred.resolve);
      }
      /*else{
          angular.forEach($http.pendingRequests, function(request,index) {
              if (request.cancel) {
                 request.cancel.resolve();
              }
          });
          $timeout(deferred.resolve);
      }     */
      return deferred.promise;
    }

    var checkOnlineStatus = function ($q, $timeout, $http, $location, $rootScope, $state, ConnectivityMonitor) {
      var deferred = $q.defer();
      if (!$rootScope.onlineStatus) {
        $timeout(deferred.reject);
        ConnectivityMonitor.offlineMessage();
      } else {
        angular.forEach($http.pendingRequests, function (request, index) {
          if (request.cancel) {
            request.cancel.resolve();
          }
        });
        $timeout(deferred.resolve);
      }
      return deferred.promise;
    }

    $stateProvider
      .state('home', {
        cache: false,
        url: '/home',
        templateUrl: 'templates/home.html',
        resolve: {
          checkData: checkData
        }

      }).state('signIn', {
        cache: false,
        url: '/signIn',
        templateUrl: 'templates/signIn.html',
        resolve: {
          checkLogOut: checkLogOut
        }

      }).state('signUp', {
        cache: false,
        url: '/signUp',
        templateUrl: 'templates/signUp.html',
        resolve: {
          checkLogOut: checkLogOut
        }

      }).state('profile', {
        cache: false,
        url: '/profile',
        templateUrl: 'templates/profile.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('profileEdit', {
        cache: false,
        url: '/profileEdit',
        templateUrl: 'templates/profileEdit.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('region/:region/:regionName', {
        url: '/region?region&regionName',
        templateUrl: 'templates/region.html',
        resolve: {
          checkOnlineStatusAndRegionData: checkOnlineStatusAndRegionData
        }

      }).state('subRegionLevel1/:region/:regionName', {
        url: '/subRegionLevel1?region&regionName',
        templateUrl: 'templates/subRegionLevel1.html',
        resolve: {
          checkOnlineStatusAndRegionData: checkOnlineStatusAndRegionData
        }

      }).state('subRegionLevel2/:region/:regionName', {
        url: '/subRegionLevel2?region&regionName',
        templateUrl: 'templates/subRegionLevel2.html',
        resolve: {
          checkOnlineStatusAndRegionData: checkOnlineStatusAndRegionData
        }

        /* 20 feb 2017 :  #102 :  remove one parameter called type=
            country which is not used currently */

      }).state('directory/:region/:regionName/:directory/:directoryName/:regionId/:q', {
        url: '/directory?region&regionName&directory&directoryName&regionId&q',
        params: {
          cache: null
        },
        templateUrl: 'templates/directory.html',
        resolve: {
          checkOnlineStatusAndListingData: checkOnlineStatusAndListingData
        }

      }).state('cls/:pId/:region/:regionName/:directoryName/:directory', {
        cache: false,
        url: '/cls?pId&region&regionName&directoryName$directory',
        templateUrl: 'templates/classified.html',
        resolve: {
          checkOnlineStatus: checkOnlineStatus
        }

      }).state('reply/:pId', {
        cache: false,
        url: '/reply?pId',
        templateUrl: 'templates/reply.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('postingDetail/:posting_title/:regionSelected/:regionTyped/:posting_id', {
        cache: false,
        url: '/postingDetail?posting_title&regionSelected&regionTyped&posting_id',
        templateUrl: 'templates/postingDetail.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('poststep1', {
        cache: false,
        url: '/poststep1',
        templateUrl: 'templates/poststep1.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('poststepSubcategory1/:parent_category_title/:parent_category_id', {
        cache: false,
        url: '/poststepSubcategory1?parent_category_title&parent_category_id',
        templateUrl: 'templates/poststepSubcategory1.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('poststepRegion/:category_title/:category_id', {
        cache: false,
        url: '/poststepRegion?category_title&category_id',
        templateUrl: 'templates/poststepRegion.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('postedDetail/:pid', {
        cache: false,
        url: '/postedDetail?pid',
        templateUrl: 'templates/postedDetail.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('activatedAd/:pid', {
        cache: false,
        url: '/activatedAd?pid',
        templateUrl: 'templates/activatedAd.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('modifyAnAd/:pid', {
        cache: false,
        url: '/modifyAnAd/:pid',
        templateUrl: 'templates/modifyAnAd.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('modifyAnAdEdit/:pid', {
        cache: false,
        url: '/modifyAnAdEdit/:pid',
        templateUrl: 'templates/modifyAnAdEdit.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('errorPage', {
        cache: false,
        url: '/errorPage',
        templateUrl: 'templates/errorPage.html'
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('getModifyLink', {
        cache: false,
        url: '/getModifyLink',
        templateUrl: 'templates/getModifyLink.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('emailSent', {
        cache: false,
        url: '/emailSent',
        templateUrl: 'templates/emailSent.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('forgotPassword', {
        cache: false,
        url: '/forgotPassword',
        templateUrl: 'templates/forgotPassword.html',
        resolve: {
          checkLogOut: checkLogOut
        }

      }).state('createAccount', {
        cache: false,
        url: '/createAccount',
        templateUrl: 'templates/createAccount.html',
        resolve: {
          checkLogOut: checkLogOut
        }

      }).state('createAccountMessage', {
        cache: false,
        url: '/createAccountMessage',
        templateUrl: 'templates/createAccountMessage.html'
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('forgotPasswordMessage', {
        cache: false,
        url: '/forgotPasswordMessage',
        templateUrl: 'templates/forgotPasswordMessage.html'
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('myAds', {
        cache: false,
        url: '/myAds',
        templateUrl: 'templates/myAds.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('sendToFriend/:pId', {
        cache: false,
        url: '/sendToFriend?pId',
        templateUrl: 'templates/sendToFriend.html',
        resolve: {
          checkOnlineStatus: checkOnlineStatus
        }
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('activated', {
        cache: false,
        url: '/activated',
        templateUrl: 'templates/activated.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('removeAd', {
        cache: false,
        url: '/removeAd',
        templateUrl: 'templates/removeAd.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('adRemoved', {
        cache: false,
        url: '/adRemoved',
        templateUrl: 'templates/adRemoved.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('repost', {
        cache: false,
        url: '/repost',
        templateUrl: 'templates/repost.html',
        resolve: {
          checkLoggedin: checkLoggedin
        }

      }).state('repostThankYou', {
        cache: false,
        url: '/repostThankYou',
        templateUrl: 'templates/repostThankYou.html'
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('termsAndCondition', {
        cache: false,
        url: '/termsAndCondition',
        templateUrl: 'templates/termsAndCondition.html',
        resolve: {
          checkOnlineStatus: checkOnlineStatus
        }
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('activateAdSMS', {
        cache: false,
        url: '/activateAdSMS',
        templateUrl: 'templates/activateAdSMS.html'
        //resolve : {checkLoggedin : checkLoggedin} ActivateSmsOrPhone

      }).state('ActivateSmsOrPhone', {
        cache: false,
        url: '/ActivateSmsOrPhone',
        templateUrl: 'templates/activateSmsOrPhone.html',
        resolve: {
          checkOnlineStatus: checkOnlineStatus
        }
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('postingAdFlagMessage/:posting_id', {
        cache: false,
        url: '/postingAdFlagMessage?posting_id',
        templateUrl: 'templates/postingAdFlagMessage.html'
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('test', {
        cache: false,
        url: '/test',
        templateUrl: 'templates/search.html'
        //resolve : {checkLoggedin : checkLoggedin}

      }).state('report', {
        cache: false,
        url: '/report',
        templateUrl: 'templates/report.html'
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

  });
