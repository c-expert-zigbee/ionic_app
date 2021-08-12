'use strict';

angular.module('starter')
  .controller('DirectoryCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, $http, $location, $anchorScroll, $cordovaToast, $ionicPopup, DirectoryService, BreadCrumbService, HomeService, ClassifiedService, $ionicHistory, $ionicModal, PluginService, $document, $window, $ionicScrollDelegate, ConnectivityMonitor) {

    $scope.swipBackUrl = $ionicHistory.backView();
    $scope.swipBackUrl = $ionicHistory.backView();
    $scope.listingAdUrl = {};
    $scope.serverError = false;
    $scope.serverErrorMessage = "";

    $scope.directoryData = [];
    $scope.nextUrlForSerach = "/eapi/v1/search";
    if (localStorage.hasOwnProperty('category') && $stateParams.directory !== 'all') {
      $scope.currentParentCategory = JSON.parse(localStorage.getItem('category'));
      $scope.parentCategoryId = $scope.currentParentCategory.category_id;
    }

    $scope.searchObj = {};
    $scope.searchAd = {};
    $scope.searchModal = {};
    $scope.searchAd.active = false;
    $scope.searchAd.spinner = false;
    $scope.address = sessionStorage.getItem('address');

    /*
        Open keyboard on click of  Try a new Search button
    */
    $scope.showKeyBoard = function () {
      $scope.messageFlag = false;
      $scope.searchPlaceExpanded = true;
      $location.hash('search');
      if ($ionicScrollDelegate)
        $ionicScrollDelegate.anchorScroll();
      $timeout(function () {
        document.getElementById('search').focus();
      }, 350);
    };

    /*
        Back to previous screen if history exist else home page
    */
    $scope.goBack = function () {
      if ($stateParams.hasOwnProperty('region') && $stateParams.region != "undefined" && $stateParams.region != undefined && $stateParams.region != "") {
        $location.url("/region?region=" + $stateParams.region + "&regionName=" + $stateParams.regionName);
      } else {
        $state.go("home");
      }
      localStorage.removeItem('listingAdUrl');
    };

    $scope.toggleSearch = function () {
      $ionicScrollDelegate.scrollTop();
      $scope.messageFlag = false;
      $scope.searchPlaceExpanded = !$scope.searchPlaceExpanded;
    };

    $scope.resetFilters = function () {
      $scope.messageFlag = false;
      $scope.directoryData = [];
      $scope.searchObj = {};
      $scope.searchAd = {};
      $scope.searchAd.active = false;
      $scope.searchPlaceExpanded = false;
      if ($stateParams.region) {
        var url = '/eapi/v1/listing/' + $stateParams.region + '/' + $stateParams.directory;
        $ionicHistory.clearCache().then(function () {
          $scope.getAdByDirectory(url);
        });
      } else {
        $ionicHistory.clearCache().then(function () {
          $scope.getSearchlist($scope.searchObj);
        });
      }
    }

    // Critical TODO 
    $scope.makeAndModel = [];
    HomeService.getVehiclelist().then(function (response) {
      if (response.length > 0) {
        angular.forEach(response, function (item, i) {
          var temp_vehicle = {
            id: i,
            label: item
          }
          $scope.makeAndModel.push(temp_vehicle);
        });
      }
    });

    $ionicModal.fromTemplateUrl('model-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openMakeModel = function () {
      $scope.modal.show();
      if ($scope.selectedModelIndex) {
        $location.hash($scope.selectedModelIndex);
        $scope.make_model_id = $scope.selectedModelIndex;
        if ($ionicScrollDelegate)
          $ionicScrollDelegate.anchorScroll();
      } else {
        $timeout(function () {
          document.getElementById('modelSearch').focus();
        }, 350);
      }
    };

    $scope.selectModel = function (model) {
      $scope.searchObj.make_model = model.label;
      $scope.selectedModelIndex = model.id;
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.addDataToSearchlist = function (url) {
      $scope.messageErrorFlag = false;
      var regionHighlight = HomeService.getNextSearchRegionList(url);

      regionHighlight.then(function (response) {
        try {
          if (response && response.hasOwnProperty('data') && response.data.searchads && response !== 'error') {
            $scope.searchObj.showSearchList = true;
            if (localStorage.getItem("lastSerPos")) {
              var key = localStorage.getItem("lastSerPos");
              $location.hash(key);
              $anchorScroll();
            }
            if (response.data.searchads.length === 0) {
              $scope.loadMore = false;
              if ($scope.directoryData.length === 0) {
                $scope.directoryData = [];
                $scope.messageFlag = true;
              }
            }
            $scope.nextUrlForSerach = response.data.next_url;
            $scope.directoryData = $scope.directoryData.concat(response.data.searchads);
            localStorage.setItem('postingData', JSON.stringify($scope.directoryData));
          } else if (response === 'error') {
            console.log('error');
          } else {
            $scope.messageFlag = true;
          }
          if ($scope.directoryData.length === 0) {
            $scope.loadMore = false;
            $scope.messageErrorFlag = true;
            $scope.message = "No ads found.";
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } catch (e) {}
      });
    };

    $scope.checkImageExist = function (data) {
      if (data.picture1 == "1") {
        return 1;
      } else if (data.picture2 == "1") {
        return 2;
      } else if (data.picture3 == "1") {
        return 3
      } else if (data.picture4 == "1") {
        return 4
      } else if (data.picture5 == "1") {
        return 5
      } else if (data.picture6 == "1") {
        return 6
      } else if (data.picture7 == "1") {
        return 7
      } else if (data.picture8 == "1") {
        return 8
      } else {
        return 0;
      }

    }

    /*
     *  validateSearchObject : This function calls serachFieldValidation function of DirectoryService validates 
     *	the search query done by user before calling search api.
     */
    $scope.validateSearchObject = function (obj) {
      var searchFieldErrorObj = DirectoryService.serachFieldValidation(obj);

      if (searchFieldErrorObj && searchFieldErrorObj.valid) {
        $scope.getSearchlist(obj);
      } else {
        if (typeof cordova !== 'undefined') {
          $cordovaToast.showLongCenter(searchFieldErrorObj.searchFieldError)
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        } else {
          alert(searchFieldErrorObj.searchFieldError);
        }
      }
    }

    $scope.getSearchlist = function (obj) {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }
      $scope.messageFlag = false;
      $scope.serverError = false;
      $scope.messageErrorFlag = false;
      $scope.searchAd.spinner = true;
      $scope.directoryData = [];
      $scope.searchAd.active = true;
      $scope.adListEmpty = false;
      $scope.searchValues = _.pick(obj, 'q', 'transmission', 'make_model'); //_.omit(obj, 'has_pic', 'regdir', 'catdir'); // _.values(obj); 
      if ($stateParams.region) obj['regdir'] = $stateParams.region;
      if ($stateParams.directory) obj['catdir'] = $stateParams.directory;
      if ($scope.regionId) obj['region_id'] = $scope.regionId;
      if ($scope.categoryId) obj['category_id'] = $scope.categoryId;
      $scope.nextUrlForSerach = "/eapi/v1/search";

      if ($stateParams.hasOwnProperty('directory') && $stateParams.hasOwnProperty('region')) {
        //var param = {"regdir":$stateParams.region, "catdir": $stateParams.directory, obj};
        var regionHighlight = HomeService.getSearchRegionList(obj);

        regionHighlight.then(function (response) {
          try {
            //$scope.searchPlaceExpanded = !$scope.searchPlaceExpanded;
            $scope.searchAd.spinner = false;
            if (response && response.hasOwnProperty('data') && response.data.searchads && response !== 'error') {
              //$scope.searchObj.showSearchList = true;
              if (localStorage.getItem("lastSerPos")) {
                var key = localStorage.getItem("lastSerPos");
                $location.hash(key);
                $anchorScroll();
              }

              if (response.data.searchads.length === 0) {
                $scope.loadMore = false;
                $scope.directoryData = [];
                $scope.messageFlag = true;

              } else {
                $scope.loadMore = true;
              }
              $scope.nextUrlForSerach = response.data.next_url;
              $scope.directoryData = $scope.directoryData.concat(response.data.searchads);
              localStorage.setItem('postingData', JSON.stringify($scope.directoryData));
              if (typeof cordova !== 'undefined') {
                if (response.data.show_adsense == 1) {
                  PluginService.AdMobService(response.data.show_adsense, true);
                } else {
                  PluginService.AdMobService(response.data.show_adsense, false);
                }
              }
            } else if (response === 'error') {
              $scope.loadMore = false;
              /*if(localStorage.getItem('adByDirectory')){
                    $scope.message = "";
                  $scope.directoryData = JSON.parse(localStorage.getItem('adByDirectory'));
              }*/
              //$state.go("errorPage");
            } else {
              //$scope.messageFlag = true;	
              $scope.loadMore = false;
            }
          } catch (e) {
            if (response.hasOwnProperty('message')) {
              $scope.serverError = true;
              $scope.serverErrorMessage = response.message;
            }
          }
        });
      } else {
        if (typeof cordova !== 'undefined') {
          $cordovaToast.showLongCenter("Type some words to look for.")
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        }

      }

    };

    $scope.onSwipeLeft = function (direction) {
      //TODO
    }

    /*
        Function which enable swipe right
    */
    $scope.onSwipeRight = function (direction) {
      if ($scope.swipBackUrl != null && $scope.swipBackUrl != '') {
        $location.url($scope.swipBackUrl.url)
      }
      if (localStorage.getItem("lastPos")) {
        localStorage.removeItem("lastPos");
      }
      if (localStorage.getItem("lastSerPos")) {
        localStorage.removeItem("lastSerPos");
      }
    }

    /*
        Function to convert date formate	
    */
    $scope.convertDate = function (date) {
      return moment(date).format('dddd, MMMM DD, YYYY');
    }

    $scope.doRefresh = function () {
      if ($stateParams.region) {
        $scope.regionCode = $stateParams.region;
        $scope.regionName = $stateParams.regionName;
        $scope.categoryCode = $stateParams.directory;
        var url = '/eapi/v1/listing/' + $stateParams.region + '/' + $stateParams.directory;
        $ionicHistory.clearCache().then(function () {
          if ($stateParams.region && $stateParams.directory) {
            $scope.getFreshAdByDirectory(url);
          }
        });
      } else {
        var url = '/eapi/v1/listing/all/' + $stateParams.directory;
        $ionicHistory.clearCache().then(function () {
          if ($stateParams.directory) {
            $scope.getFreshAdByDirectory(url);
          }
        });
      }

    };

    /**
     * Function to Get fresh ads list by region and category OR by category 
     */
    $scope.getFreshAdByDirectory = function (url) {
      $scope.loadMore = false;
      $scope.serverError = false;
      $scope.searchAd = {};
      $scope.searchObj = {};
      $scope.searchAd.active = false;
      $scope.searchPlaceExpanded = false;
      $scope.messageErrorFlag = false;
      var params = {
        url: url
      };
      var directory = DirectoryService.getDirectoriesForRefresh(params);
      directory.then(function (response) {
        try {
          $scope.categoryId = response.data.category_id;
          $scope.regionId = response.data.region_id;
          if (response && response.hasOwnProperty('data') && response.data.list[0] && response !== 'error') {
            $scope.messageErrorFlag = false;
            $scope.loadMore = true;
            if (localStorage.getItem("lastPos")) {
              var key = localStorage.getItem("lastPos");
              $location.hash(key);
              $anchorScroll();
            }
            $scope.directoryData = [];
            $scope.nextUrl = response.data.next_url;
            $scope.directoryData = $scope.directoryData.concat(response.data.list);
            localStorage.setItem('postingData', JSON.stringify($scope.directoryData));
            if (typeof cordova !== 'undefined') {
              if (response.data.show_adsense == 1) {
                PluginService.AdMobService(response.data.show_adsense, true);
              } else {
                PluginService.AdMobService(response.data.show_adsense, false);
              }
            }
            localStorage.setItem('adByDirectory', JSON.stringify($scope.directoryData));
          } else if (response === 'error') {
            if (localStorage.getItem('adByDirectory')) {
              $scope.directoryData = JSON.parse(localStorage.getItem('adByDirectory'));
            }
            //$state.go("errorPage");
          } else {
            $scope.loadMore = false;
            if ($scope.directoryData.length === 0) {
              $scope.messageErrorFlag = true;
              $scope.message = "No ads found.";
            }
          }
          $scope.$broadcast('scroll.refreshComplete');
        } catch (e) {
          if (response.hasOwnProperty('message')) {
            $scope.serverError = true;
            $scope.serverErrorMessage = response.message;
          }
        }
      });
    }

    /**
     * Function to Get ads list by region and category	OR by category 
     */
    $scope.getAdByDirectory = function (url) {
      $scope.messageErrorFlag = false;
      $scope.serverError = false;
      var params = {
        url: url
      };
      var directory = DirectoryService.getDirectories(params);
      directory.then(function (response) {
        try {
          $scope.categoryId = response.data.category_id;
          $scope.regionId = response.data.region_id;
          if (response && response.hasOwnProperty('data') && response.data.list[0] && response !== 'error') {
            $scope.messageErrorFlag = false;
            $scope.loadMore = true;
            if (localStorage.getItem("lastPos")) {
              var key = localStorage.getItem("lastPos");
              $location.hash(key);
              $anchorScroll();
            }
            $scope.nextUrl = response.data.next_url;
            //_.each($scope.directoryData, function(item){ item.published_date_epoch = response.data.list[0].published_date_epoch;});
            $scope.directoryData = $scope.directoryData.concat(response.data.list);
            localStorage.setItem('postingData', JSON.stringify($scope.directoryData));
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if (typeof cordova !== 'undefined') {
              if (response.data.show_adsense == 1) {
                PluginService.AdMobService(response.data.show_adsense, true);
              } else {
                PluginService.AdMobService(response.data.show_adsense, false);
              }
            }
            //localStorage.setItem('adByDirectory',JSON.stringify($scope.directoryData));

          } else if (response === 'error') {
            /*if(localStorage.getItem('adByDirectory')){
                  $scope.message = "";
                $scope.directoryData = JSON.parse(localStorage.getItem('adByDirectory'));
            }*/
            //ConnectivityMonitor.offlineMessage();
            //$state.go("errorPage");
          } else {
            $scope.loadMore = false;
            if ($scope.directoryData.length === 0) {
              $scope.messageErrorFlag = true;
              $scope.message = "No ads found.";
            }
          }
        } catch (e) {
          if (response && response.hasOwnProperty('message')) {
            $scope.serverError = true;
            $scope.serverErrorMessage = response.message;
          }
        }
      });
    }

    var TimeOutTimerValue = 1000 * 60 * 5;
    var refreshingPromise;
    $scope.isRefreshing = false;

    $scope.startRefreshing = function () {
      if ($scope.isRefreshing) return;
      $scope.isRefreshing = true;
      (function refreshEvery() {
        //$scope.doRefresh();
        refreshingPromise = $timeout(refreshEvery, TimeOutTimerValue)
      }());
    }
    $rootScope.$on($scope.$on('$destroy', function () {
      //$timeout.cancel(TimeOut_Thread);
      $timeout.cancel(refreshingPromise);
    }));

    //var TimeOut_Thread = $timeout(function(){ $scope.startRefreshing()} , TimeOutTimerValue);
    var bodyElement = angular.element($document);
    bodyElement.bind('scroll', function (e) {
      TimeOut_Resetter(e)
    });

    function TimeOut_Resetter(e) {
      $timeout.cancel(TimeOut_Thread);
      //TimeOut_Thread = $timeout(function(){ $scope.startRefreshing() } , TimeOutTimerValue);
    }

    // $scope.trackDragEvent = function(){
    //   	$timeout.cancel(refreshingPromise);
    //   	$timeout.cancel(TimeOut_Thread);
    //   	$scope.isRefreshing = true;
    //   	$timeout(function(){
    //   	$scope.isRefreshing =false;
    //   	  	/// Reset the timeout
    //       	TimeOut_Thread = $timeout(function(){ $scope.startRefreshing() } , TimeOutTimerValue);
    //   	}, 10000);
    // }

    /*
        Function to Get next ads list according to limit and offset  
    */
    $scope.addItems = function (onlineStatus) {
      if ($rootScope.onlineStatus || onlineStatus) {
        $ionicHistory.clearCache().then(function () {
          if ($scope.searchAd && $scope.searchAd.active == true) {
            $scope.addDataToSearchlist($scope.nextUrlForSerach);
          } else {
            $scope.getAdByDirectory($scope.nextUrl);
          }

        });
      }
    }

    $scope.setRegions = function (data, key, index) {
      localStorage.setItem("breadCrumbRegion", data);
      localStorage.setItem("lastPos", key);
      localStorage.setItem("postedAdIndex", index);
      localStorage.setItem("PostedAdregionCode", $scope.regionCode);
    };

    // $scope.setRegionsSearch = function(data,key) {
    //     localStorage.setItem("lastSerPos", key);
    // }

    if ($stateParams.hasOwnProperty("directory")) {
      $scope.directoryName = $stateParams.directoryName;
      $scope.listingAdUrl.directoryName = $stateParams.directoryName;
      $scope.listingAdUrl.directory = $stateParams.directory;
      localStorage.setItem('listingAdUrl', JSON.stringify($scope.listingAdUrl));
      $scope.directory = $stateParams.directory;

      $scope.$on('$ionicView.beforeEnter', function () {
        if ($stateParams.cache === false) {}
      });

      if ($stateParams.directory == 'all') {
        $stateParams.directory = '';
        if ($stateParams.q && $stateParams.q != "undefined") {
          $scope.searchObj.q = $stateParams.q;
          $scope.searchPlaceExpanded = true;
        }
        if ($stateParams.regionId) {
          $scope.regionId = $stateParams.regionId;
        }
        $scope.getSearchlist($scope.searchObj);
      } else if ($stateParams.region) {
        $scope.listingAdUrl.region = $stateParams.region;
        $scope.listingAdUrl.regionName = $stateParams.regionName;
        localStorage.setItem('listingAdUrl', JSON.stringify($scope.listingAdUrl));
        $scope.regionCode = $stateParams.region;
        $scope.regionName = $stateParams.regionName;
        $scope.categoryCode = $stateParams.directory;
        var url = '/eapi/v1/listing/' + $stateParams.region + '/' + $stateParams.directory
        $ionicHistory.clearCache().then(function () {
          if ($stateParams.region && $stateParams.directory) {
            $scope.getAdByDirectory(url);
          } else {}
        });
      } else {
        var url = '/eapi/v1/listing/all/' + $stateParams.directory;
        $ionicHistory.clearCache().then(function () {
          if ($stateParams.directory) {
            $scope.getAdByDirectory(url);
          }
        });
      }
    } else {
      alert("please enter city name");
    }
  });
