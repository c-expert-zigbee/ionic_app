'use strict';

angular.module('starter')
    .controller('MyAdsCtrl', function ($scope, MyAds, $rootScope, $state, $stateParams, $http, $location, $ionicPopup, $cordovaToast, $ionicHistory, $timeout, $ionicScrollDelegate, HomeService, ConnectivityMonitor, ResponseValidation, PluginService, ClassifiedService) {
        document.addEventListener('deviceready', function (e) {
            if (typeof cordova != 'undefined') {
                PluginService.AdMobService(0, false);
            }
        });

        $scope.searchAndFilter = {};
        $scope.showSearchAndFilter = function () {
            $ionicScrollDelegate.scrollTop();
            $scope.widgetExpanded = !$scope.widgetExpanded;
        };

        $scope.showMsg = false;
        $scope.address = sessionStorage.getItem('address');

        $scope.filterData = [{ "name": "Active", "displayName": "Active" },
        { "name": "Inactive", "displayName": "Inactive" },
        { "name": "expired", "displayName": "Expired" },
        { "name": "premium", "displayName": "Premium" }
        ];

        $scope.sortData = [{ "name": "CREATION_DATE ASC", "displayName": "Creation Date Asc" },
        { "name": "CREATION_DATE DESC", "displayName": "Creation Date Desc" },
        { "name": "PUBLISHED_DATE ASC", "displayName": "Published Date Asc" },
        { "name": "PUBLISHED_DATE DESC", "displayName": "Published Date Desc" },
        { "name": "EXPIRATION_DATE ASC", "displayName": "Expiration Date Asc" },
        { "name": "EXPIRATION_DATE DESC", "displayName": "Expiration Date Desc" }
        ];

        $scope.goToProfile = function () {
            $state.go("profile");
        };

        $scope.swipBackUrl = $ionicHistory.backView();
        $scope.daysAgo = function (ads) {
            if (ads) {
                $scope.isDayAgo = ClassifiedService.isDayAgo(ads);
                return $scope.isDayAgo
            }
        }

        /**
         * Function which enable swipe right
         */
        $scope.onSwipeRight = function (direction) {
            if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
                $location.url($scope.swipBackUrl.url)
            }
        }

        if (localStorage.getItem("profile")) {
            $scope.profile = JSON.parse(localStorage.getItem('profile'));
        }

        $scope.convertDate = function (date) {
            return moment(date).format('dddd, MMMM DD, YYYY');
        };

        $scope.checkImageExist = function (data) {
            for (var i = 1; i <= 8; i++) {
                if (data['picture' + i] == "1") {
                    //$scope.imageIndex = data['picture'+i];
                    return i; //$scope.address+'/img/'+ads.posting_id+'.'+i+'.jpg?w=90;h=75';
                    break;
                }
            }
        }

        $scope.AdPageCount = 1;
        $scope.myAds = [];
        $scope.stop = true;
        $scope.loadMore = false;

        $scope.getMyAds = function (param) {
            param = "?page=" + param;
            MyAds.myAds(param).then(function (response) {
                if (response.status == 200 && response.data.hasOwnProperty('myads') && response.data.myads[0]) {
                    $scope.stop = false;
                    if (response.data.myads.length >= 50) {
                        $scope.AdPageCount = $scope.AdPageCount + 1;
                        $scope.loadMore = true;
                    }
                    $scope.myAds = $scope.myAds.concat(response.data.myads);
                }
                else {
                    $scope.loadMore = false;
                    if (response.status == 422 && response.data.error == 'Authentication failed') {
                        if (ResponseValidation.logout()) {
                            ConnectivityMonitor.authenticationFailedMessage();
                            $state.go('signIn');
                        }
                    } else {
                        if ($scope.myAds.length == 0) {
                            $scope.showMsg = true;
                            $scope.messageFlag = false;
                            $scope.stop = false;
                            $scope.msg = (response.hasOwnProperty('data') && response.data.hasOwnProperty('error'))
                                ? response.data.error : 'You have no ads posted.';
                        }
                    }
                }
            });
        };
        $scope.getMyAds($scope.AdPageCount);

        $scope.delay = function () {
            //return true;
            $timeout(function () { $scope.val = true }, 2000);
            return $scope.val;
        };

        $scope.showKeyBoard = function () {
            $scope.messageFlag = false;
            $scope.AdPageCount = 1;
            //$scope.getMyAds($scope.AdPageCount);
            $timeout(function () {
                document.getElementById('search').focus();
            }, 5);
        };

        $scope.searchMyAds = function (searchAndFilter) {
            //param = "?page="+param;
            $scope.messageFlag = false;
            var param = {};
            if (searchAndFilter && searchAndFilter.sort != undefined) {
                param['sort'] = searchAndFilter.sort;
            }
            if (searchAndFilter && searchAndFilter.filter != undefined) {
                param['filter'] = searchAndFilter.filter;
            }
            if (searchAndFilter && searchAndFilter.q != undefined) {
                param['q'] = searchAndFilter.q;
            }

            // = {"sort":searchAndFilter.sort != undefined ? searchAndFilter.sort : "", "filter":searchAndFilter.filter != undefined ?  searchAndFilter.filter : "" , "q": searchAndFilter.q != undefined ?  searchAndFilter.q :""};
            MyAds.searchAds(param).then(function (response) {
                if (response.status == 200 && response.data.hasOwnProperty('myads') && response.data.myads[0]) {
                    $scope.myAds = [];
                    $scope.myAds = $scope.myAds.concat(response.data.myads);
                }
                else {
                    $scope.myAds = [];
                    if (response.status == 422 && response.data.error == 'Authentication failed') {
                        if (ResponseValidation.logout()) {
                            ConnectivityMonitor.authenticationFailedMessage();
                            $state.go('/signIn');
                        }
                    } else {
                        $scope.messageFlag = true;
                        $scope.showMsg = false;
                        $scope.msg = 'You have no ads posted.';
                    }
                }
            });
        };

        $scope.resetMyAdsFilters = function () {
            $scope.loadMore = false;
            $scope.messageFlag = false;
            $scope.searchAndFilter = {};
            var param = {};
            $scope.AdPageCount = 1;
            $scope.myAds = [];
            $scope.getMyAds($scope.AdPageCount);
            $scope.widgetExpanded = !$scope.widgetExpanded;
        }

        /**
         * Function to Get next ads list according to limit and offset  
         */
        $scope.addItems = function (onlineStatus) {
            if (onlineStatus) {
                if (!$scope.widgetExpanded) {
                    $scope.getMyAds($scope.AdPageCount);
                } else {
                    $scope.loadMore = false;
                }

            }
        }

        /**
         * send to modify page when click on each Ad of Adlist 
         */
        $scope.sendToModify = function (ads) {
            $location.url('/modifyAnAd/' + ads.posting_id);
        };

        /**
         * send to post an Ad page 
         */
        $scope.goToPostAnAd = function () {
            $state.go("poststep1");
        };
    }).directive('errImage', function () {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return attrs['ngSrc'];
                }, function (value) {
                    if (!value) {
                        element.css('display', 'none');
                    }
                });
                element.bind('error', function () {
                    element.css('display', 'none');
                });
            }
        }
    });