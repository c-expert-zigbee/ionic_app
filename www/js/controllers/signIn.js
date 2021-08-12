'use strict';

angular.module('starter')

    .controller('SignInCtrl', function ($scope, $rootScope, $state, $http, $location, $ionicPopup, $cordovaToast, $q, $timeout, $ionicHistory, $ionicActionSheet, ConnectivityMonitor, SignInService, ResponseValidation, Profile, PluginService, ErrorService) {
        // Triggered on a button click, or some other target
        $scope.show = function () {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: '<b>Share</b> This'
                },
                {
                    text: 'Move'
                }
                ],
                destructiveText: 'Delete',
                titleText: 'Modify your album',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    return true;
                }
            });
            // For example's sake, hide the sheet after two seconds
            $timeout(function () {
                hideSheet();
            }, 20000);
        };

        $scope.checkRemember = function (remember) {
            if (remember === true) {
                localStorage.setItem('rememberMe', "true");
            } else {
                localStorage.setItem('rememberMe', "false");
            }
        }

        $scope.goBack = function () {
            localStorage.removeItem("goToPostAnAd");
            $location.url("home");
        };

        $rootScope.toggleMenu = false;
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        $scope.loginData = {};

        document.addEventListener('deviceready', function (e) {
            if (typeof cordova != 'undefined') {
                PluginService.AdMobService(0, false);
            }
        });

        $scope.login = function (loginpage) {
            if ($rootScope.onlineStatus) {
                $scope.submitted = true;
                if (loginpage.$valid) {
                    $scope.stop = true;
                    $scope.submitted = false;
                    $scope.loginData["todo"] = "signin";
                    var validationRuleObj = [{
                        key: 'api_key',
                        type: 'string',
                        required: true
                    }, {
                        key: 'access_key',
                        type: 'string',
                        required: true
                    }];
                    var dialog = PluginService.dialogBox('Please Wait...', 'Checking your credentials...');
                    SignInService.login($scope.loginData).then(function (response, httpStatus) {
                        $timeout(function () {
                            dialog.close();
                        }, 2000);
                        if (response != undefined && response.status == 200) {
                            if (localStorage.hasOwnProperty('goToPostAnAd')) {
                                $scope.sendToPostAnAd = localStorage.getItem("goToPostAnAd");
                            }
                            localStorage.setItem('loginData', JSON.stringify($scope.loginData));
                            $scope.validationResponse = ResponseValidation.validateResponse(response.httpStatus, response, validationRuleObj);
                            if ($scope.validationResponse.validation == true) {
                                localStorage.setItem("sessionData", JSON.stringify(response.data));
                                localStorage.setItem('authenticated', true);
                                Profile.getProfile().then(function (response) {
                                    $scope.stop = false;
                                    localStorage.setItem('profile', JSON.stringify(response.data.profile));
                                    if ($ionicHistory && $ionicHistory.backView() && $ionicHistory.backView().stateName == "cls/:pId/:region/:regionName/:directoryName/:directory") {
                                        localStorage.setItem('reply-back', JSON.stringify({
                                            "stateName": $ionicHistory.backView().stateName,
                                            "stateParams": $ionicHistory.backView().stateParams
                                        }));
                                        $location.url("/reply?pId=" + $ionicHistory.backView().stateParams.pId);
                                    } else if ($ionicHistory && $ionicHistory.backView() == null || $scope.sendToPostAnAd == 'true') {
                                        $state.go('poststep1');
                                        localStorage.removeItem("goToPostAnAd");
                                    } else {
                                        $state.go('myAds');
                                    }
                                });
                            } else {
                                var errorData = ErrorService.errorDialogContent(response.status, response.data, response.message);
                                $scope.stop = false;
                                if (errorData.data.hasOwnProperty('status')) {
                                    $scope.errorMessage = errorData.data.error;
                                    $scope.errorCode = errorData.data.error_code;
                                } else {
                                    $scope.errorMessage = '';
                                    $scope.errorCode = '';
                                }
                                $scope.showErr = true;
                                if (typeof cordova !== 'undefined') {
                                    $cordovaToast.showLongCenter($scope.errorMessage)
                                        .then(function (success) {
                                            // success
                                        }, function (error) {
                                            // error
                                        });
                                }
                            }
                        } else {
                            var errorData = ErrorService.errorDialogContent(response.status, response.data, response.message);
                            $scope.stop = false;
                            if (errorData.data.hasOwnProperty('status')) {
                                $scope.errorMessage = errorData.data.error;
                                $scope.errorCode = errorData.data.error_code;
                            } else {
                                $scope.errorMessage = '';
                                $scope.errorCode = '';
                            }
                            $scope.showErr = true;
                        }
                    });
                } else {
                    $scope.submitted = true;
                    var errors = ErrorService.composeErrorMessage(loginpage.$error);
                    if (typeof cordova !== 'undefined') {
                        $cordovaToast.showLongCenter(errors)
                            .then(function (success) {
                                // success
                            }, function (error) {
                                // error
                            });
                    } else {
                        alert(errors);
                    }
                }
            } else {
                ConnectivityMonitor.offlineMessage();
            }
        }

        $scope.swipBackUrl = $ionicHistory.backView();

        $scope.onSwipeLeft = function (direction) {
            //TODO
        }

        $scope.onSwipeRight = function (direction) {
            if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
                $location.url($scope.swipBackUrl.url)
            }
        }

        if (localStorage.getItem('rememberMe') === "true") {
            var loginData = JSON.parse(localStorage.getItem('loginData'));
            if (loginData) {
                $scope.loginData.email = loginData.email;
                $scope.remember = true;
            }
        } else {
            var loginData = JSON.parse(localStorage.getItem('loginData'));
            if (loginData) {
                $scope.loginData.email = loginData.email;
                $scope.remember = false;
            }
        }

        $scope.goToCreatePage = function () {
            $location.url("/createAccount");
        }

    });
