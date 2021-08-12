'use strict';

angular.module('starter')

    .controller('ModifyAnAdCtrl', function ($ionicPlatform, $scope, $rootScope, $cordovaCamera, $state, $timeout, $stateParams, $http, $location, $ionicHistory, $ionicPopup, $ionicModal, $cordovaToast, $sce, $ionicSlideBoxDelegate, Upload, MyAds, ClassifiedService, ResponseValidation, RegionService, PluginService, ErrorService, ConnectivityMonitor, ConfigService) {

        document.addEventListener('deviceready', function (e) {
            // Handle the event...
            if (typeof cordova != 'undefined') {
                PluginService.AdMobService(0, false);
            }
        });

        $ionicModal.fromTemplateUrl('image-modal-modify.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal1 = modal;
        });

        // MODIFY AD MODAL
        $ionicModal.fromTemplateUrl('modifyAdModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal2 = modal;
        });

        // AD REMOVE MODAL
        $ionicModal.fromTemplateUrl('removeAdModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal3 = modal;
        });

        $ionicModal.fromTemplateUrl('thank-you-repost-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.thankyouRepostModal = modal;
        });


        $scope.openThankyouRepostModal = function () {
            $scope.thankyouRepostModal.show();
            $ionicSlideBoxDelegate.update();
        };

        $scope.closeThankyouRepostModal = function () {
            $scope.thankyouMessage = "";
            $scope.thankyouRepostModal.hide();
        }

        $ionicModal.fromTemplateUrl('thank-you-remove-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.thankyouRemoveModal = modal;
        });

        $scope.openThankyouRemoveModal = function () {
            $scope.thankyouRemoveModal.show();
            $ionicSlideBoxDelegate.update();
        };

        $scope.closeThankyouRemoveModal = function () {
            $scope.thankyouRemoveModal.hide();
        }

        $ionicModal.fromTemplateUrl('thank-you-activate-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.thankyouActivateModal = modal;
        });

        $scope.openThankyouActivateModal = function () {
            $scope.thankyouActivateModal.show();
            $ionicSlideBoxDelegate.update();
        };

        $scope.closeThankyouActivateModal = function () {
            $scope.thankyouActivateModal.hide();
        }

        $scope.openModal = function () {
            $scope.modal.show();
            $ionicSlideBoxDelegate.update();
        };

        $scope.openModifyModal = function () {
            $scope.modal2.show();
        }

        $scope.closeModifyModal = function () {
            $scope.modal2.hide();
        }

        $scope.openRemoveAdModal = function () {
            $scope.modal3.show();
        }

        $scope.closeRemoveAdModal = function () {
            $scope.modal3.hide();
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            //$scope.modal.remove();
        });

        // Call this functions if you need to manually control the slides
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };

        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.slide = function (index) {
            $ionicSlideBoxDelegate.slide(index);
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };

        $scope.pId = $stateParams.pid;
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData = JSON.parse(localStorage.getItem("sessionData"));
        $scope.profile = JSON.parse(localStorage.getItem('profile'));
        $scope.swipBackUrl = $ionicHistory.backView();

        $scope.imageList = [];
        $scope.image = {};
        $scope.picture = [];

        $scope.goToMyAds = function () {
            $state.go("myAds");
        };

        $scope.goToRepost = function () {
            $state.go("repost");
        };

        $scope.goToProfile = function () {
            $ionicHistory.clearCache().then(function () {
                $state.go("profile");
            });
        };

        $scope.backToModify = function () {
            $location.url('/modifyAnAd/' + $stateParams.pid);
        }

        $scope.goToEdit = function () {
            $location.url('/modifyAnAdEdit/' + $stateParams.pid);
        }

        /**
         * Function which enable swipe right
         */
        $scope.onSwipeRight = function (direction) {
            if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
                $location.url($scope.swipBackUrl.url);
            }
        }

        /**
         * The Posting ID on the modify page should go to the the posting on the web using browser.
         */
        $scope.sendToActivatedAdPage = function () {
            var address = sessionStorage.getItem('address');
            var URL = address + "/cls/" + $stateParams.pid + ".html"
            if ($rootScope.onlineStatus) {
                window.open(URL, '_system');
            } else {
                ConnectivityMonitor.offlineMessage();
            }
        };

        /**
         * Method returm posting detail by postingId
         */
        $scope.getPostingDetail = function () {
            var params = {
                pId: $stateParams.pid
            };
            var classified = ClassifiedService.getClassifiedDetails(params);
            $scope.stop = true;
            classified.then(function (response) {
                try {
                    if (response && response.hasOwnProperty('data')) {
                        $scope.message = "";
                        $scope.classifiedData = response.data;
                        $scope.category_id = $scope.classifiedData.posting.category_id;
                        $scope.parent_category_id = $scope.classifiedData.posting.parent_category_id;
                        $scope.classifiedData.posting.new_region = $scope.classifiedData.posting.new_region != null ? $scope.classifiedData.posting.new_region : "";
                        $scope.classifiedData.posting.item_price = parseFloat($scope.classifiedData.posting.item_price);
                        $scope.classifiedData.posting.housing_available_price = parseFloat($scope.classifiedData.posting.housing_available_price);
                        $scope.classifiedData.posting.description = $scope.classifiedData.posting.description.replace(/<br\s*\/?>/g, '\n');
                        localStorage.setItem('currentAd', JSON.stringify($scope.classifiedData));

                        $scope.hideStaticData = false;

                        $scope.imageList = [];
                        $scope.items = [];
                        $scope.pictureLeft = [];
                        $scope.pictureLeftIndex = [];

                        for (var i = 1; i <= 8; i++) {
                            if (response.data.posting['picture' + i] == "1") {
                                $scope.hasPictures = true;
                                var address = sessionStorage.getItem('address');
                                var url = address + "/img/" + response.data.posting.posting_id + "." + i + ".jpg?h=250;&dt=" + (new Date().getTime());
                                $scope.items.push({
                                    "src": url,
                                    "picture": 'picture' + i,
                                    "position": i
                                });
                                if ($scope.items.length == 1) {
                                    $scope.firstImageUrl = address + "/img/" + response.data.posting.posting_id + "." + i + ".jpg?h=250;&dt=" + (new Date().getTime());
                                }
                            } else {
                                if ($scope.pictureLeft.length == 0) {
                                    $scope.imageList.push({
                                        "src": "",
                                        "picture": 'picture' + i,
                                        "position": i
                                    });
                                }
                                $scope.pictureLeft.push({
                                    "src": "",
                                    "picture": 'picture' + i,
                                    "position": i
                                });
                                $scope.pictureLeftIndex.push('picture' + i);
                            }
                        }

                        $scope.currentPicturesLength = $scope.items.length > 0 ? $scope.items.length : 0;
                        $scope.count = parseInt($scope.currentPicturesLength + $scope.imageList.length);
                        $scope.title = $sce.trustAsHtml($scope.classifiedData.posting.display_title);
                        $scope.stop = false;
                        if (typeof cordova !== 'undefined') {
                            PluginService.AdMobService(0, false);
                        }
                    } else if (response === 'error') {
                        $scope.stop = false;
                        $state.go("errorPage");
                    }
                } catch (e) {
                    $scope.stop = false;
                }
            });

        };

        /**
         * Open a model where we can select car type.
         */
        $scope.makeAndModel = ConfigService.getMarkAndModel();

        $scope.callbackMethod = function (query, isInitializing) {
            var filtered = [];
            var regex = new RegExp(".*" + query + ".*", "ig");
            angular.forEach($scope.makeAndModel, function (item) {
                if (regex.test(item)) {
                    filtered.push(item);
                }
            });
            $scope.classifiedData.posting.make_model = query;
            return filtered;
        }

        /**
         * Method to check whether to dispaly days ago or not.
         */
        $scope.daysAgo = function (ads) {
            if (ads) {
                $scope.isDayAgo = ClassifiedService.isDayAgo(ads);
                return $scope.isDayAgo
            }
        }

        $scope.convertSecondToEpoch = function (str) {
            return moment(str).unix();
        }

        /**
         * Method to check whether to dispaly isActive  or not.
         */
        $scope.isForActivate = function () {
            if ($scope.classifiedData) {
                $scope.isForActivateFlag = ClassifiedService.isForActivate($scope.classifiedData.posting);
                return $scope.isForActivateFlag
            }
        }

        /**
         * Method to check whether to dispaly Premium  or not.
         */
        $scope.isForPremium = function () {
            if ($scope.classifiedData) {
                $scope.isForPremiumFlag = ClassifiedService.isForPremium($scope.classifiedData.posting);
                return $scope.isForPremiumFlag
            }
        }

        /**
         * Method to check whether to dispaly Remove  or not.
         */
        $scope.isForRemove = function () {
            if ($scope.classifiedData) {
                $scope.isForRemoveFlag = ClassifiedService.isForRemove($scope.classifiedData.posting);
                return $scope.isForRemoveFlag
            }
        }

        /**
         * Method to check whether to dispaly Repost  or not.
         */
        $scope.isForRepost = function () {
            if ($scope.classifiedData) {
                $scope.isForRepostFlag = ClassifiedService.isForRepost($scope.classifiedData.posting);
                return $scope.isForRepostFlag
            }
        }

        /**
         * Below method is checking wheather image object is empty or not
         */
        $scope.isEmpty = function (obj) {
            for (var i in obj)
                if (obj.hasOwnProperty(i)) return true;
            return false;
        };

        $scope.addNewImage = function (index) {
            if ($scope.imageList.length < $scope.pictureLeftIndex.length) {
                $scope.imageList.splice(index, 1, {
                    'id': index
                });
            }
        };

        /**
         * Dynamicly removing row from imageList which is display in
         * posting step 3 for removing images row.
         */
        $scope.removeImage = function (index) {
            for (var i = index; i < $scope.pictureLeftIndex.length - 1; i++) {
                $scope.image[i] = $scope.image[i + 1];
                $scope.picture['picture' + (i + 1)] = $scope.picture['picture' + (i + 2)];
            }
            $scope.picture['picture' + $scope.imageList.length] = undefined;
            if ($scope.imageList.length == $scope.pictureLeftIndex.length && $scope.image[$scope.pictureLeftIndex.length - 1]) {
                $scope.image[$scope.pictureLeftIndex.length - 1] = undefined;
                $scope.imageList[$scope.pictureLeftIndex.length - 1] = {
                    'id': $scope.pictureLeftIndex.length - 1
                };
            } else {
                if ($scope.imageList.length > 1) {
                    $scope.imageList.splice(index, 1);
                }
            }
        };

        /**
         * Below method is for capturing image from mobile then display
         * it in posting step 3 and then upload to the respective server
         */
        $scope.takePicture = function (index, obj) {
            var options = {
                quality: 100,
                sourceType: 1,
                destinationType: 1,
                encodingType: 0,
                mediaType: 0
            };

            if (typeof cordova !== 'undefined') {
                $cordovaCamera.getPicture(options).then(function (filePath) {
                    Upload.urlToBlob(filePath).then(function (blob) {
                        if ($scope.imageList.indexOf(obj) >= 0) {
                            $scope.image[index] = undefined;
                            $scope.image[index] = filePath;
                            index = index + 1;
                            $scope.picture['picture' + index] = blob;
                            if (!$scope.image[index]) {
                                $scope.addNewImage(index);
                            }
                        }
                    });
                });
            }
        };

        /**
         * Below method is for selecting image from mobile gallery then display
         * it in posting step 3 and then upload to the respective server
         */
        $scope.getPicture = function (index, obj) {
            var options = {
                quality: 100,
                sourceType: 0,
                destinationType: 0,
                encodingType: 0,
                mediaType: 0
            };

            if (typeof cordova !== 'undefined') {
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    if ($scope.imageList.indexOf(obj) >= 0) {
                        $scope.image[index] = undefined;
                        $scope.image[index] = "data:image/jpeg;base64," + imageData;
                        index = index + 1;
                        $scope.picture['picture' + index] = Upload.dataUrltoBlob("data:image/jpeg;base64," + imageData, 'picture' + index);
                        if (!$scope.image[index]) {
                            $scope.addNewImage(index);
                        }
                    }
                });
            }
        };

        $scope.currrentCheckboxSelection = function (value) {
            $scope.classifiedData.posting.hide_email = value;
        };

        /**
         * Method to activate the Ad, if action = "sendsmscode" || action = "sendsmscode"  then redirect to ActivateSmsOrPhone page 
         */
        $scope.activateAd = function () {
            if ($rootScope.onlineStatus) {
                var validationRuleObj = [{
                    key: 'activate',
                    type: 'string',
                    required: true,
                    value: 'Your ad has been activated. Thank you!'
                }];
                var dialog = PluginService.dialogBox('Please Wait...', 'Activating Ad...');
                var activateParsers = {
                    "unique_id": $scope.classifiedData.posting.unique_id,
                    "email": $scope.classifiedData.posting.email
                };

                MyAds.activateAd($scope.classifiedData.posting.posting_id, activateParsers).then(function (response) {
                    $timeout(function () {
                        dialog.close();
                    }, 2000);
                    $scope.validationResponse = ResponseValidation.validateResponse(response.httpStatus, response, validationRuleObj);
                    if (response.status == 422 && response.data.error == 'Authentication failed') {
                        if (ResponseValidation.logout()) {
                            ConnectivityMonitor.authenticationFailedMessage();
                            $state.go('signIn');
                        }
                    } else if ($scope.validationResponse.validation == true) {
                        $timeout(function () {
                            $scope.showCheckedLogo = true;
                            $scope.activationMessage = "Your ad has been activated.<br/>Thank you!";
                            $scope.openThankyouActivateModal();
                            dialog.close();
                            $scope.classifiedData.posting.ad_status = "Active (Pending)";
                        }, 1000);
                        $scope.items = [];
                        $scope.getPostingDetail();
                    } else if (response && response.hasOwnProperty('data') && response.data.action == "sendsmscode") {
                        localStorage.setItem('actionType', JSON.stringify(response.data.action));
                        $state.go("ActivateSmsOrPhone");
                    } else if (response && response.hasOwnProperty('data') && response.data.action == "savephone") {
                        localStorage.setItem('actionType', JSON.stringify(response.data.action));
                        $state.go("ActivateSmsOrPhone");
                    } else if (response && response.hasOwnProperty('data') && response.data.action == "default") {
                        $scope.stop = false;
                        $scope.errMessage = response.data.activate;
                        $scope.showCheckedLogo = false;
                        $scope.activationMessage = response.data.activate;
                        $scope.showErr = true;
                        $timeout(function () {
                            $scope.openThankyouActivateModal();
                            $scope.classifiedData.posting.ad_status = "Active (Pending)";
                            dialog.close();
                        }, 1000);
                    } else {
                        $scope.stop = false;
                        $scope.errMessage = "Ad could not be activated";
                        $scope.showErr = true;
                        ErrorService.showErrorMessage($scope.errMessage);
                    }
                });
            } else {
                ConnectivityMonitor.offlineMessage();
            }
        };

        /**
         * New remove method wich redirect to remove page
         */
        $scope.removeAd = function () {
            if ($rootScope.onlineStatus) {
                $scope.modal3.hide();
                var validationRuleObj = [{
                    key: 'remove',
                    type: 'string',
                    required: true,
                    value: 'success'
                }];
                var dialog = PluginService.dialogBox('Please Wait...', 'Removing Ad...');
                var removeParsers = {
                    "unique_id": $scope.classifiedData.posting.unique_id,
                    "email": $scope.classifiedData.posting.email
                };
                MyAds.removeAd($scope.classifiedData.posting.posting_id, removeParsers).then(function (response) {
                    $timeout(function () {
                        dialog.close();
                    }, 2000);
                    $scope.validationResponse = ResponseValidation.validateResponse(response.httpStatus, response, validationRuleObj);
                    if (response.status == 422 && response.data.error == 'Authentication failed') {
                        if (ResponseValidation.logout()) {
                            ConnectivityMonitor.authenticationFailedMessage();
                            $state.go('signIn');
                        }
                    } else if ($scope.validationResponse.validation == true) {
                        $timeout(function () {
                            $scope.openThankyouRemoveModal();
                        }, 1000)
                        $scope.items = [];
                        $scope.getPostingDetail();
                    } else {
                        $scope.stop = false;
                        $scope.errMessage = "Ad could not be removed";
                        $scope.showErr = true;
                        ErrorService.showErrorMessage($scope.errMessage);
                    }
                });
            } else {
                ConnectivityMonitor.offlineMessage();
            }
        }

        // NEW REPOST MOVED FROM REPOST PAGE
        $scope.repost = function () {
            var validationRuleObj = [{
                key: 'repost',
                type: 'string',
                required: true
            }];
            var dialog = PluginService.dialogBox('Please Wait...', 'Reposting Ad...');
            var repostParsers = {
                "unique_id": $scope.classifiedData.posting.unique_id,
                "email": $scope.classifiedData.posting.email
            };
            MyAds.repostAd($scope.classifiedData.posting.posting_id, repostParsers).then(function (response) {
                $timeout(function () {
                    dialog.close();
                }, 1000);
                $scope.validationResponse = ResponseValidation.validateResponse(response.httpStatus, response, validationRuleObj);
                if ($scope.validationResponse.validation == true) {
                    if (response.status == 200 && response.data.repost == "Success") {
                        $timeout(function () {
                            $scope.repostMessage = "Your ad has been reposted.<br/>Thank you!";
                            $scope.openThankyouRepostModal();
                        }, 1000);
                        $scope.items = [];
                        $scope.getPostingDetail();
                    } else if (response.status == 200 && response.data.repost != "Success") {
                        $timeout(function () {
                            $scope.repostMessage = response.data.repost;
                            $scope.openThankyouRepostModal();
                        }, 1000);
                        $scope.items = [];
                        $scope.getPostingDetail();
                    } else if (response.status == 422 && response.data.error == 'Authentication failed') {
                        if (ResponseValidation.logout()) {
                            ConnectivityMonitor.authenticationFailedMessage();
                            $state.go('signIn');
                        }
                    } else {
                        var successMsg = PluginService.dialogBox(response.data.repost);
                        $timeout(function () {
                            successMsg.close();
                        }, 4000);
                        $scope.items = [];
                        $scope.getPostingDetail();
                    }
                } else {
                    $scope.stop = false;
                    $scope.errMessage = "Ad could not be reposted";
                    $scope.showErr = true;
                    ErrorService.showErrorMessage($scope.errMessage);
                }
            });
        };

        /**
         * Premium link that goes to web using browser.
         */
        $scope.premium = function () {
            var address = sessionStorage.getItem('address');
            var URL = address + "/scripts/posting/premium.epl?id=" + $scope.classifiedData.posting.unique_id + "&email=" + $scope.profile.email;
            if ($rootScope.onlineStatus) {
                window.open(URL, '_system');
            } else {
                ConnectivityMonitor.offlineMessage();
            }
        }

        $scope.convertDate = function (date) {
            return moment(date).format('dddd, MMMM DD, YYYY');
        };

        $scope.convertNumber = function (data) {
            return parseInt(data);
        }

        if ($stateParams.pid != undefined) {
            $scope.stop = true;
            $ionicHistory.clearCache();
            $scope.getPostingDetail();
        }

        $scope.currentSelection = [];

        $scope.checkForDelete = function (data) {
            if ($scope.currentSelection.length > 0 && _.contains($scope.currentSelection, data)) {
                return true;
            } else {
                return false
            }
        };

        $scope.deleteImage = [];
        $scope.removeSelectedImage = function (data, index) {
            if ($scope.imageList.length == 0) {
                $scope.imageList.push({
                    "src": "",
                    "picture": data.picture
                });
            }
            if (_.contains($scope.currentSelection, data)) {
                var index = $scope.currentSelection.indexOf(data);
                _.findWhere($scope.pictureLeft, {
                    picture: data.picture
                })
                var deleteImageIndex = $scope.deleteImage.indexOf(_.findWhere($scope.deleteImage, {
                    key: "delete_" + data.picture
                }));
                $scope.currentSelection.splice(index, 1);
                $scope.deleteImage.splice(deleteImageIndex, 1);
                $scope.currentPicturesLength = ($scope.items.length - $scope.currentSelection.length > 0 ? $scope.items.length - $scope.currentSelection.length : $scope.currentSelection.length - $scope.items.length);
                $scope.count = parseInt($scope.currentPicturesLength + $scope.imageList.length);
            } else {
                $scope.currentSelection.push(data);
                $scope.deleteImage.push({
                    "value": 1,
                    "key": "delete_" + data.picture
                });
                $scope.currentPicturesLength = ($scope.items.length - $scope.currentSelection.length > 0 ? $scope.items.length - $scope.currentSelection.length : $scope.currentSelection.length - $scope.items.length);
                $scope.count = parseInt($scope.currentPicturesLength + $scope.imageList.length);
            }
        };

        $scope.saveChanges = function (modifyAd) {
            if ($rootScope.onlineStatus) {
                $scope.submitted = true;
                if (modifyAd.$valid) {
                    $scope.submitted = false;
                    var dialog = PluginService.dialogBox('Please Wait...', 'Saving Ad...');
                    $scope.classifiedData.postingData = {
                        'unique_id': $scope.classifiedData.posting.unique_id,
                        'email': $scope.classifiedData.posting.email,
                        'contact_number': $scope.classifiedData.posting.contact_number,
                        'new_region': $scope.classifiedData.posting.new_region,
                        'description': $scope.classifiedData.posting.description,
                        'hide_email': $scope.classifiedData.posting.hide_email,
                        'title': $scope.classifiedData.posting.title
                    };

                    if ($scope.parent_category_id == '8' || $scope.category_id == '9') {
                        $scope.classifiedData.postingData['item_price'] = $scope.classifiedData.posting.item_price;
                    }

                    if ($scope.parent_category_id == '1000' || $scope.parent_category_id == '1006' || $scope.parent_category_id == '8' || $scope.category_id == '9') {
                        $scope.classifiedData.postingData['currency_field'] = $scope.classifiedData.posting.currency_field;
                    }

                    if ($scope.category_id == '7' || $scope.category_id == '3' || $scope.category_id == '5' || $scope.category_id == '2' || $scope.category_id == '4' || $scope.category_id == '6' || $scope.category_id == '16') {
                        $scope.classifiedData.postingData['housing_available_bedrooms'] = $scope.classifiedData.posting.housing_available_bedrooms;
                    }

                    if ($scope.parent_category_id == '1000' || $scope.parent_category_id == '1006') {
                        $scope.classifiedData.postingData['housing_price'] = $scope.classifiedData.posting.housing_available_price;
                    }

                    if ($scope.category_id == '7' || $scope.category_id == '3' || $scope.category_id == '5' || $scope.category_id == '2' || $scope.category_id == '4' || $scope.category_id == '143' || $scope.category_id == '144' || $scope.category_id == '3007' || $scope.category_id == '3008') {
                        $scope.classifiedData.postingData['housing_available_period'] = $scope.classifiedData.posting.housing_available_period;
                    }

                    if ($scope.parent_category_id == '136' || $scope.parent_category_id == '153') {
                        $scope.classifiedData.postingData['personals_age'] = $scope.classifiedData.posting.personals_age;
                    }

                    if ($scope.category_id == '300') {
                        $scope.classifiedData.postingData['make_model'] = $scope.classifiedData.posting.make_model;
                    }

                    if ($scope.category_id == '300') {
                        $scope.classifiedData.postingData['year'] = $scope.classifiedData.posting.year;
                    }

                    if ($scope.category_id == '300') {
                        $scope.classifiedData.postingData['transmission'] = $scope.classifiedData.posting.transmission;
                    }

                    if ($scope.parent_category_id == '3018' || $scope.category_id == '3021' || $scope.category_id == '3022' || $scope.category_id == '3023' || $scope.category_id == '3024' || $scope.category_id == '3025' || $scope.parent_category_id == '3026' || $scope.category_id == '3027' || $scope.category_id == '3028' || $scope.category_id == '3029' || $scope.category_id == '3030') {
                        $scope.classifiedData.postingData['area_type'] = $scope.classifiedData.posting.area_type;
                        $scope.classifiedData.postingData['area'] = $scope.classifiedData.posting.area;
                        $scope.classifiedData.postingData['commercial_price'] = $scope.classifiedData.posting.commercial_price;
                    }

                    if ($scope.category_id == '300') {
                        $scope.classifiedData.postingData['odometer'] = $scope.classifiedData.posting.odometer;
                    }

                    if ($scope.pictureLeftIndex.length > 0) {
                        for (var i = 0; i < $scope.pictureLeftIndex.length; i++) {
                            $scope.classifiedData.postingData[$scope.pictureLeftIndex[i]] = $scope.picture['picture' + (i + 1)];
                        }
                    }

                    if ($scope.deleteImage.length > 0) {
                        $scope.deleteImage.forEach(function (pic, index) {
                            if (pic.value == 1) {
                                $scope.classifiedData.postingData[pic.key] = pic.value;
                            }
                        });
                    }

                    Upload.upload({
                        url: address + proxy + '/' + version + '/posting/' + $scope.classifiedData.posting.posting_id,
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'PROJECT_KEY': project_key,
                            'ACCESS_KEY': sessionData.access_key,
                            'API_KEY': sessionData.api_key
                        },
                        data: $scope.classifiedData.postingData
                    }).success(function (result) {
                        $timeout(function () {
                            dialog.close();
                            $scope.modal2.hide();
                        }, 1000);
                        if (result.status == 200) {
                            var params = {
                                pid: $stateParams.pid
                            };
                            $state.transitionTo($state.current, params, {
                                location: true,
                                reload: true,
                                inherit: true,
                                notify: true
                            });
                        } else if (response.status == 422 && response.data.error == 'Authentication failed') {
                            if (ResponseValidation.logout()) {
                                ConnectivityMonitor.authenticationFailedMessage();
                                $state.go('signIn');
                            }
                        } else if (result.status != 200 && result.data && result.data.hasOwnProperty('error')) {
                            $scope.showErr = true;
                            var errorData = ErrorService.errorDialogContent(result.status, result.data, result.message);
                            $scope.errMessage = errorData.data.error;
                            $scope.errorCode = errorData.data.error_code;
                            ErrorService.showErrorMessage(result.data.error);
                        } else {
                            $scope.showErr = true;
                            var errorData = ErrorService.errorDialogContent(result.status, result.data, result.message);
                            $scope.errMessage = errorData.data.error;
                            $scope.errorCode = errorData.data.error_code;
                            ErrorService.showErrorMessage(result.data.error);
                        }
                    }).error(function (e) {
                        $timeout(function () {
                            dialog.close();
                            $scope.modal2.hide();
                        }, 1000);
                        // The case for Auth 
                        $scope.showErr = true;
                        var errorData = ErrorService.errorDialogContent(e.status, e.data, e.message);
                        $scope.errMessage = errorData.data.error;
                        $scope.errorCode = errorData.data.error_code;
                    });
                } else {
                    $scope.submitted = true;
                    var errors = ErrorService.composeErrorMessage(modifyAd.$error);
                    ErrorService.showErrorMessage(errors);
                }
            } else {
                ConnectivityMonitor.offlineMessage();
            }
        };
    }).directive('numberConverter', function () {
        return {
            priority: 1,
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                function toModel(value) {
                    return "" + value; // convert to string
                }

                function toView(value) {
                    return parseInt(value); // convert to number
                }
                ngModel.$formatters.push(toView);
                ngModel.$parsers.push(toModel);
            }
        };
    }).directive('contenteditable', ['$sce', function ($sce) {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                };
                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
                    scope.$evalAsync(read);
                });
                read();
                // Write data to the model
                function read() {
                    var html = element.html();
                    if (attrs.stripBr && html === '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            }
        };
    }]);