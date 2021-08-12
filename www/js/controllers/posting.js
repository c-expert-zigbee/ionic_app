'use strict';

angular.module('starter')

  .controller('PostingStep1Ctrl', function ($scope, $rootScope, $state, $stateParams, $http, $location, $sce, $ionicPopup, $timeout, $cordovaToast, $ionicHistory, SessionService, ReplyService, PluginService, ErrorService, AuthenticationService, ConnectivityMonitor, ResponseValidation) {

    $rootScope.toggleMenu = false;
    $scope.showError = false;

    var project_key = sessionStorage.getItem('project_key');
    var sessionData = JSON.parse(localStorage.getItem("sessionData"));

    $scope.goToHome = function () {
      $location.url("home");
    };

    AuthenticationService.checkLoginStatus().then(function (response) {
      if (response.status == 422 && response.data.error == 'Authentication failed') {
        if (ResponseValidation.logout()) {
          ConnectivityMonitor.authenticationFailedMessage();
          $state.go('signIn');
        }
      }
    });

    /**
     * admob should only appear on region, listing and posting pages
     */
    document.addEventListener('deviceready', function (e) {
      if (typeof cordova != 'undefined') {
        PluginService.AdMobService(0, false);
      }
    });

    if ($ionicHistory) {
      $scope.swipBackUrl = $ionicHistory.backView();
    }

    /**
     * Function which enable swipe right
     */
    $scope.onSwipeRight = function (direction) {
      if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
        $location.url($scope.swipBackUrl.url)
      }
    }

    /**
     * Navigating to the next step of posting called sub-catategory or step 1b if
     * sub-category list have some date, otherwise navigate to the region section 
     * which is posting stpe 2.
     */
    $scope.subCategoryStep = function (parent_category_id, parent_category_title, cat) {
      $rootScope.toggleMenu = false;
      if (cat.subcategories.length > 0) {
        localStorage.setItem("currentSelection", "sell");
        localStorage.setItem("currentSelectedCategory", JSON.stringify(cat));
        $state.go("poststepSubcategory1/:parent_category_title/:parent_category_id", {
          parent_category_title: parent_category_title,
          parent_category_id: parent_category_id
        });
      } else {
        localStorage.setItem("currentSelection", "buy");
        localStorage.setItem("currentSelectedCategory", JSON.stringify(cat));
        $state.go("poststepRegion/:category_title/:category_id", {
          category_title: parent_category_title,
          category_id: parent_category_id
        });
      }
    };

    /**
     * Navigating to the next step of posting called region section  or step 2.
     */
    $scope.selectSubCategories = function (category_id, category_title) {
      $rootScope.toggleMenu = false;
      $state.go("poststepRegion/:category_title/:category_id", {
        category_title: category_title,
        category_id: category_id
      });

    };

    /**
     * Below method return a list of categories which is shown in posting step 1a
     * or category section. 
     */
    $scope.getAllCategories = function () {
      var address = sessionStorage.getItem('address');
      var proxy = sessionStorage.getItem('proxy');
      var version = sessionStorage.getItem('version');
      $http({
        method: 'GET',
        url: address + proxy + '/' + version + '/classifieds/all/category',
        data: $scope.dataObj,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'PROJECT_KEY': project_key,
          'ACCESS_KEY': sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : ''
        },
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        }
      }).success(function (response) {
        if (response.status == 200 && response.data.categories.length > 0) {
          $scope.categoryList = response.data;
        } else {
          $scope.showError = true;
          $scope.errorMessage = (response.hasOwnProperty('message')) ?
            response.message : 'Server error occurred.';
          $scope.errorCode = response.data.error_code;
          $scope.error = response.data.error;
        }
      }).error(function (e) {
        $scope.showError = true;
        var errorData = ErrorService.parseErrorContent(e, status, header);
        SessionService.setObject('errorObject', errorData);
        deferred.reject;
        $location.url('/errorPage');
      });

    };
    $scope.getAllCategories();
  }).controller('PostStepSubcategory1Ctrl', function ($scope, $rootScope, $state, $stateParams, $http, $location, $sce, $ionicPopup, $timeout, $cordovaToast, $ionicHistory, ReplyService, PluginService) {
    $rootScope.toggleMenu = false;
    $scope.goToHome = function () {
      //$ionicHistory.goBack();
      $location.url("home");
    };

    /**
     * Back Navigation method
     */
    $scope.historyBack = function () {
      $rootScope.toggleMenu = false;
      $ionicHistory.goBack();
    };

    /* admob should only appear on region, listing and posting pages.*/
    document.addEventListener('deviceready', function (e) {
      // Handle the event...
      if (typeof cordova != 'undefined') {
        PluginService.AdMobService(0, false);
      }
    });

    if ($ionicHistory) {
      $scope.swipBackUrl = $ionicHistory.backView();
    }

    /*
        Function which enable swipe right
    */
    $scope.onSwipeRight = function (direction) {
      if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
        $location.url($scope.swipBackUrl.url)
      }
    }

    /**
          $scope.currentSelectedCategory holding current selected category from posting
          step 1a.
    */
    $scope.currentSelectedCategory = JSON.parse(localStorage.getItem("currentSelectedCategory"));

    /**
          After selecting sub-category its  navigating to the next step of posting 
          called region section  or step 2.
    */
    $scope.selectSubCategories = function (category_id, category_title, subcat) {
      localStorage.setItem("currentSelectedSubCategory", JSON.stringify(subcat));
      $state.go("poststepRegion/:category_title/:category_id", {
        category_title: category_title,
        category_id: category_id
      });

    };

    /**
        Back Navigation method from posting step 1b to 1a
    */
    $scope.backToCategory = function () {
      $state.go("poststep1");
    }

  }).controller('PostRegionCtrl', function (RegionService, $ionicModal, $scope, $rootScope, $state, $stateParams, $http, $location, $sce, $ionicPopup, $timeout, $cordovaToast, $ionicHistory, ReplyService, PluginService, $ionicScrollDelegate) {

    $rootScope.toggleMenu = false;
    if (localStorage.getItem("currentUserRegion")) {
      $scope.countryOrCity = JSON.parse(localStorage.getItem("currentUserRegion"));
    } else {
      $scope.countryOrCity = {};
    }
    $scope.goToHome = function () {
      //$ionicHistory.goBack();
      $location.url("home");
    };

    /* admob should only appear on region, listing and posting pages.*/
    document.addEventListener('deviceready', function (e) {
      // Handle the event...
      if (typeof cordova != 'undefined') {
        PluginService.AdMobService(0, false);
      }
    });

    if ($ionicHistory) {
      $scope.swipBackUrl = $ionicHistory.backView();
    }

    /*
        Function which enable swipe left
    */
    $scope.onSwipeLeft = function (direction, typedRegion, countryOrCity) {
      $scope.selectRegion(typedRegion, $scope.countryOrCity.name);
      //TODO
    }

    /*
        Function which enable swipe right
    */
    $scope.onSwipeRight = function (direction) {
      if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
        $location.url($scope.swipBackUrl.url)
      }
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
      if ($scope.countryOrCity.region_id) {
        $scope.goToSelectedCountry($scope.countryOrCity.region_id);
      }
    };
    $scope.selectCountry = function (countryOrCity, currency) {
      $scope.countryOrCity = countryOrCity;
      localStorage.setItem("currentUserRegion", JSON.stringify(countryOrCity));
      localStorage.setItem("currency", currency);
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.historyBack = function () {
      $rootScope.toggleMenu = false;
      $ionicHistory.goBack();
    };

    /**
          Below method is for fetching all country list.
    */

    $scope.sortName = function (regionArray) {
      regionArray.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      return regionArray;
    }

    $scope.locations = JSON.parse(localStorage.getItem('regions'));
    $scope.regions = $scope.locations.continents;
    $scope.countryList = _.pluck($scope.regions, 'countries');
    var countryListArray = [].concat.apply([], $scope.countryList);
    countryListArray = $scope.sortName(countryListArray);

    $scope.regionList = [];
    angular.forEach(countryListArray, function (country) {
      country.showName = country.name;
      var country_currency = country.currency;
      $scope.regionList.push(country);
      if (country.cities) {
        country.cities = $scope.sortName(country.cities);
        angular.forEach(country.cities, function (city) {
          city.showName = ". . . " + city.name;
          city.currency = country_currency;
          $scope.regionList.push(city);
          if (city.subcities && city.subcities.length > 0) {
            city.subcities = $scope.sortName(city.subcities);
            angular.forEach(city.subcities, function (subcity) {
              subcity.showName = ". . . . . . " + subcity.name;
              subcity.currency = country_currency;
              $scope.regionList.push(subcity);
            });
          }
        });
      }
    });

    if ($stateParams.category_title != undefined) {
      $scope.postingCategory = $stateParams.category_title;
    } else {
      $scope.postingCategory = "";
    }

    if ($stateParams.category_id != undefined) {
      $scope.postingCategoryId = $stateParams.category_id;
    } else {
      $scope.postingCategoryId = "";
    }

    $scope.findRegionFromList = function (regionName) {
      var regionArray = [].concat.apply($scope.locations.countries, $scope.locations.cities);
      regionArray = [].concat.apply(regionArray, $scope.locations.subcities);
      var regionObj = _.findWhere(regionArray, {
        "name": regionName
      });
      return regionObj
    }

    if (localStorage.hasOwnProperty("currentUserRegion")) {
      $scope.currentSelectionRegion = JSON.parse(localStorage.getItem("currentUserRegion"));
      if ($scope.currentSelectionRegion.name != "") {
        var regionObjectFromList = $scope.findRegionFromList($scope.currentSelectionRegion.name)
        if (regionObjectFromList) {
          $scope.countryOrCity.name = regionObjectFromList.name;
          $scope.countryOrCity.region_id = regionObjectFromList.region_id;
          localStorage.setItem("currentUserRegion", JSON.stringify($scope.countryOrCity));
          var currentCurrency = regionObjectFromList.currency != undefined ? regionObjectFromList.currency : regionObjectFromList.currency_code;
          localStorage.setItem("currency", currentCurrency);
        }
      }
    } else if (localStorage.hasOwnProperty("profile")) {
      $scope.profile = JSON.parse(localStorage.getItem('profile'));
      if ($scope.profile.region_name != "") {
        var regionObjectFromList = $scope.findRegionFromList($scope.profile.region_name)
        if (regionObjectFromList) {
          $scope.countryOrCity.name = regionObjectFromList.name;
          $scope.countryOrCity.region_id = regionObjectFromList.region_id;
          localStorage.setItem("currentUserRegion", JSON.stringify($scope.countryOrCity));
          var currentCurrency = regionObjectFromList.currency != undefined ? regionObjectFromList.currency : regionObjectFromList.currency_code;
          localStorage.setItem("currency", currentCurrency);
        }
      }
    }

    $scope.goToSelectedCountry = function (region_id) {
      $location.hash(region_id);
      $ionicScrollDelegate.anchorScroll();
    }

    /**
     * After selecting region its  navigating to the next step of posting 
     * called posting detail section  or step 3.
     */
    $scope.selectRegion = function (typed, selected) {
      localStorage.setItem("currentTypedRegion", typed);
      $rootScope.toggleMenu = false;
      if (selected) {
        $state.go("postingDetail/:posting_title/:regionSelected/:regionTyped/:posting_id", {
          posting_title: $scope.postingCategory,
          regionSelected: selected != undefined ? selected : "",
          regionTyped: typed != undefined ? typed : "",
          posting_id: $scope.postingCategoryId
        });
      } else {
        if (typeof cordova !== 'undefined') {
          $cordovaToast.showLongCenter('Please, select a region.')
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        } else {
          alert("Please, select a region");
        }
      }
    };

    /**
        Back Navigation method from posting step 2 to 1a
    */
    $scope.backToCategory = function () {
      $state.go("poststep1");
    }

    /**
        Back Navigation method from posting step 2 to 1b
    */
    $scope.backToSubCategory = function () {
      if (localStorage.hasOwnProperty('currentSelectedSubCategory')) {
        $state.go("poststepSubcategory1/:parent_category_title/:parent_category_id", {
          parent_category_title: $stateParams.category_title,
          parent_category_id: $stateParams.category_id
        });
        localStorage.removeItem("currentSelectedSubCategory");
      } else {
        $state.go("poststep1");
      }
    }

  }).controller('PostDetailCtrl', function ($scope, $rootScope, $state, $stateParams, $http, $location, $sce, $ionicPopup, $timeout, $cordovaToast, $ionicHistory, $cordovaCamera, $ionicModal, ReplyService, Upload, PluginService, ErrorService, ConnectivityMonitor, ResponseValidation, MyAds, SessionService, HomeService, $ionicScrollDelegate) {
    /* admob should only appear on region, listing and posting pages.*/
    document.addEventListener('deviceready', function (e) {
      // Handle the event...
      if (typeof cordova != 'undefined') {
        PluginService.AdMobService(0, false);
      }
    });

    $timeout(function () {
      document.getElementById('title').focus();
    }, 350);

    $scope.goToHome = function () {
      //$ionicHistory.goBack();
      $location.url("home");
    };

    $scope.openBrowser = function (postId) {
      var URL = 'http://www.expatriates.com/cls/' + postId + '.html';
      if ($rootScope.onlineStatus) {
        window.open(URL, '_system', 'location=yes');
      } else {
        ConnectivityMonitor.offlineMessage();
      }
    };

    $rootScope.toggleMenu = false;
    $scope.errorMessageFlag = false;
    var project_key = sessionStorage.getItem('project_key');
    var sessionData = JSON.parse(localStorage.getItem("sessionData"));
    $scope.sessionData = JSON.parse(localStorage.getItem("sessionData"));
    $scope.postingObj = {};
    $scope.searchModal = {};
    if (localStorage.getItem('profile')) {
      $scope.profile = JSON.parse(localStorage.getItem('profile'));
      $scope.postingObj.email = $scope.profile.email;
    }

    $scope.postingObj.hide_email = '0';
    $scope.currentSelectionRegion = JSON.parse(localStorage.getItem("currentUserRegion"));
    $scope.postingObj.currency_field = localStorage.getItem("currency");
    $scope.currentSelectedCategory = JSON.parse(localStorage.getItem("currentSelectedCategory"));
    $scope.parent_category_id = $scope.currentSelectedCategory.category_id;
    $scope.currentSelectedSubCategory = JSON.parse(localStorage.getItem("currentSelectedSubCategory"));
    if ($scope.currentSelectedSubCategory) {
      $scope.has_images = $scope.currentSelectedSubCategory.has_images;
    }

    if ($ionicHistory) {
      $scope.swipBackUrl = $ionicHistory.backView();
    }

    /*
        Function which enable swipe left
    */
    $scope.onSwipeLeft = function (direction) {
      //TODO
    }

    /*
        Function which enable swipe right
    */
    $scope.onSwipeRight = function (direction) {
      if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
        $location.url($scope.swipBackUrl.url)
      }
    }

    /**
        Back Navigation method.
    */
    $scope.historyBack = function () {
      $rootScope.toggleMenu = false;
      $ionicHistory.goBack();
    };

    $scope.imageList = [{
      id: 0
    }];
    $scope.image = {};
    $scope.picture = {};


    $ionicModal.fromTemplateUrl('thank-you-posting-modal.html', {
      scope: $scope,
      backdropClickToClose: false,
      hardwareBackButtonClose: false,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.thankyouPostingModal = modal;
    });

    $scope.openThankyouPostingModal = function () {
      $scope.thankyouPostingModal.show();
      // Important: This line is needed to update the current ion-slide's width
      // Try commenting this line, click the button and see what happens
    };

    $scope.closeThankyouPostingModal = function (data) {
      if (data && data == "activation") {
        $scope.thankyouPostingModal.hide();
      } else {
        $location.url('/modifyAnAd/' + $scope.postingId);
        $scope.thankyouPostingModal.hide();
      }
    }

    $ionicModal.fromTemplateUrl('thank-you-activation-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.thankyouActivationModal = modal;
    });

    $scope.openThankyouActivationModal = function () {
      $scope.thankyouActivationModal.show();
    };

    $scope.closeThankyouActivationModal = function () {
      $scope.thankyouMessage = "";
      $location.url('/modifyAnAd/' + $scope.postingId);
      $scope.thankyouActivationModal.hide();
    }

    /**
        Dynamicly adding row in imageList which is display in
        posting step 3 for adding images row.
    */
    $scope.addNewImage = function (index) {
      if ($scope.imageList.length < 8) {
        $scope.imageList.splice(index, 1, {
          'id': index
        });
      }
    };

    /**
        Dynamicly removing row from imageList which is display in
        posting step 3 for removing images row.
    */
    $scope.removeImage = function (index) {
      for (var i = index; i < 7; i++) {
        $scope.image[i] = $scope.image[i + 1];
        $scope.picture['picture' + (i + 1)] = $scope.picture['picture' + (i + 2)];
      }
      $scope.picture['picture' + $scope.imageList.length] = undefined;
      if ($scope.imageList.length == 8 && $scope.image[7]) {
        $scope.image[7] = undefined;
        $scope.imageList[7] = {
          'id': 7
        };
      } else {
        if ($scope.imageList.length > 1) {
          $scope.imageList.splice(index, 1);
        }
      }
    };

    /**
        Back Navigation method from posting step 3 to step 1a
    */
    $scope.backToCategory = function () {
      $state.go("poststep1");
    }

    /**
        Back Navigation method from posting step 3 to step 1b
    */
    $scope.backToSubCategory = function () {
      $state.go("poststepSubcategory1/:parent_category_title/:parent_category_id", {
        parent_category_title: $stateParams.posting_title,
        parent_category_id: $stateParams.posting_id
      });
    }

    /**
        Back Navigation method from posting step 3 to step 2
    */
    $scope.backToLocation = function () {
      //$state.go("postedDetail/:pid",{pid : '31463457'});
      $state.go("poststepRegion/:category_title/:category_id", {
        category_title: $stateParams.posting_title,
        category_id: $stateParams.posting_id
      });
    }

    /**
        Below method is checking wheather image object is empty or not
    */
    $scope.isEmpty = function (obj) {
      for (var i in obj)
        if (obj.hasOwnProperty(i)) return true;
      return false;
    };

    /**
        Below method is for capturing image from mobile then display
        it in posting step 3 and then upload to the respective server
    */
    $scope.takePicture = function (obj, index) {
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
        Below method is for selecting image from mobile gallery then display
        it in posting step 3 and then upload to the respective server
    */
    $scope.getPicture = function (obj, index) {
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


    if ($stateParams.posting_title != undefined) {
      $scope.postingCategory = $stateParams.posting_title;
    } else {
      $scope.postingCategory = "";
    }

    if ($stateParams.regionSelected != undefined) {
      $scope.regionSelected = $stateParams.regionSelected;
    } else {
      $scope.regionSelected = "";
    }

    if ($stateParams.regionTyped != undefined) {
      $scope.regionTyped = $stateParams.regionTyped;
    } else {
      $scope.regionTyped = "";
    }

    if ($stateParams.posting_id != undefined) {
      $scope.category_id = $stateParams.posting_id;
    } else {
      $scope.category_id = "";
    }

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
      $timeout(function () {
        document.getElementById('modelSearch').focus();
      }, 300);
      if ($scope.selectedModelIndex) {
        $location.hash($scope.selectedModelIndex);
        $scope.make_model_id = $scope.selectedModelIndex;
        if ($ionicScrollDelegate)
          $ionicScrollDelegate.anchorScroll();
      }
    };

    $scope.selectModel = function (model) {
      $scope.postingObj.make_model = model.label;
      $scope.selectedModelIndex = model.id;
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.currrentCheckboxSelection = function (value) {
      $scope.postingObj.hide_email = value;
    };

    $scope.sendToModifiedAdPage = function () {
      //$state.go("modifyAnAd/:pid",{pid : $scope.postingId});
      $scope.closeThankyouPostingModal();
    };

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
          "email": $scope.profile.email
        };
        MyAds.activateAd($scope.postingId, activateParsers).then(function (response) {
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
            //var successMsg = PluginService.dialogBox('Your ad has been activated. Thank you!');
            $timeout(function () {
              $scope.thankyouMessage = "Your ad has been activated. Thank you!";
              $scope.closeThankyouPostingModal("activation");
              $scope.openThankyouActivationModal();
              dialog.close();
            }, 1000);
          } else if (response && response.hasOwnProperty('data') && response.data.action == "sendsmscode") {
            localStorage.setItem('actionType', JSON.stringify(response.data.action));
            $scope.thankyouPostingModal.hide();
            $state.go("ActivateSmsOrPhone");

          } else if (response && response.hasOwnProperty('data') && response.data.action == "savephone") {
            localStorage.setItem('actionType', JSON.stringify(response.data.action));
            $scope.thankyouPostingModal.hide();
            $state.go("ActivateSmsOrPhone");
          } else if (response && response.hasOwnProperty('data') && response.data.action == "default") {
            $scope.stop = false;
            $scope.errMessage = response.data.activate;
            $scope.showErr = true;
            $scope.thankyouPostingModal.hide();
            ErrorService.showErrorMessage($scope.errMessage);
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
        Below method is for posting Ad with above required value
    */
    $scope.postAd = function (postAnAd) {
      if ($rootScope.onlineStatus) {
        $rootScope.toggleMenu = false;
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');

        $scope.submitted = true;
        if (postAnAd.$valid && sessionData) {
          $scope.submitted = false;
          $scope.postingObj['region_id'] = $scope.currentSelectionRegion.region_id;
          $scope.postingObj['region'] = $scope.currentSelectionRegion.region_id + "-" + $scope.currentSelectionRegion.name;
          $scope.postingObj['new_region'] = $scope.regionTyped;
          $scope.postingObj['category_id'] = $scope.category_id;
          $scope.postingObj['category_title'] = $scope.postingCategory;
          $scope.postingObj["title"] = $scope.postingObj.title;
          $scope.postingObj["description"] = $scope.postingObj.description;

          if ($scope.picture.hasOwnProperty('picture1')) {
            $scope.allPictures = _.keys($scope.picture);
            $scope.allPictures.forEach(function (pic, index) {
              $scope.postingObj["picture" + (index + 1)] = $scope.picture[pic];
            });
          }

          var dialog = PluginService.dialogBox('Please Wait...', 'Posting Ad...');
          Upload.upload({
            url: address + proxy + '/' + version + '/posting',
            headers: {
              'Content-Type': "application/x-www-form-urlencoded",
              'PROJECT_KEY': project_key,
              'ACCESS_KEY': sessionData.access_key,
              'API_KEY': sessionData.api_key
            },
            data: $scope.postingObj
          }).success(function (result) {
            $timeout(function () {
              dialog.close();
            }, 1000);
            if (result.data.posting_id != undefined && result.data.posting_id != '') {
              $scope.postingId = result.data.posting_id;
              $scope.openThankyouPostingModal();
            } else if (result.status == 422 && result.data.error == 'Authentication failed') {
              if (ResponseValidation.logout()) {
                ConnectivityMonitor.authenticationFailedMessage();
                $state.go('signIn');
              }
            } else {
              $scope.showErr = true;
              var errorData = ErrorService.errorDialogContent(result.status, result.data, result.message);
              $scope.errMessage = errorData.data.error;
              $scope.errorCode = errorData.data.error_code;
              ErrorService.showErrorMessage(errorData.data.error);
            }

          }).error(function (e) {
            $scope.stop = true;
            var errorData = ErrorService.parseErrorContent(e, status, header);
            SessionService.setObject('errorObject', errorData);
            $location.url('/errorPage');
          });
        } else if (postAnAd.$valid && !sessionData) {
          if (typeof cordova !== 'undefined') {
            $cordovaToast.showLongCenter("Please, login to post an Ad.")
              .then(function (success) {
                // success
              }, function (error) {
                // error
              });
            $state.go('signIn');

          } else {
            alert("Please, login to post an Ad.");
            $state.go('signIn');
          }
        } else {
          $scope.submitted = true;
          var errors = ErrorService.composeErrorMessage(postAnAd.$error);
          if (typeof cordova !== 'undefined') {
            $cordovaToast.showLongCenter(errors)
              .then(function (success) {
                // success
              }, function (error) {
                // error
              });
          } else {
            //alert(errors);
          }

        }
      } else {
        ConnectivityMonitor.offlineMessage();
      }

    }
  }).controller('activatedAdCtrl', function ($scope, $rootScope, $state, $stateParams, $http, $location, $sce, $ionicPopup, $timeout, $cordovaToast, $ionicHistory, $cordovaCamera, ClassifiedService, ReplyService, Upload, PluginService) {

    /* admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function (e) {
      // Handle the event...
      if (typeof cordova != 'undefined') {
        PluginService.AdMobService(0, false);
      }
    });

    var address = sessionStorage.getItem('address');
    $scope.items = [];

    $scope.swipBackUrl = $ionicHistory.backView();

    $scope.goBackToModify = function () {
      $ionicHistory.goBack();
    };

    $scope.onSwipeRight = function (direction) {
      if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
        $location.url($scope.swipBackUrl.url)
      }
    }

    $scope.onSwipeLeft = function (direction) {

    }

    $scope.classifiedData = JSON.parse(localStorage.getItem('postedAd'));
    if ($scope.classifiedData != null && $scope.classifiedData.posting.pictures.length > 0) {
      $scope.hasPictures = true;
      $scope.items = [];
      var address = sessionStorage.getItem('address');
      var url = address + "/img/" + $scope.classifiedData.posting.posting_id;
      for (var i = 1; i <= 8; i++) {
        if ($scope.classifiedData.posting['picture' + i] == "1") {
          $scope.items.push({
            src: url + "." + i + ".jpg"
          });
        }
      }
    } else {
      var params = {
        pId: $stateParams.pid
      };
      var classified = ClassifiedService.getClassifieds(params);
      classified.then(function (response) {
        try {
          if (response && response.hasOwnProperty('data')) {
            $scope.message = "";
            $scope.classifiedData = response.data;
            $scope.hideStaticData = false;
            if (response.data.posting.picture1 == 1) {
              $scope.hasPictures = true;
              $scope.items = [];
              var address = sessionStorage.getItem('address');
              var url = address + "/img/" + response.data.posting.posting_id;
              for (var i = 1; i <= 8; i++) {
                if (response.data.posting['picture' + i] == "1") {
                  $scope.items.push({
                    src: url + "." + i + ".jpg"
                  });
                }
              }
            }
            $scope.title = $sce.trustAsHtml($scope.classifiedData.posting.display_title);
          } else if (response === 'error') {
            $state.go("errorPage");
          } else {
            $scope.message = "No ads found";
          }
        } catch (e) {}
      });
    }

  }).controller('postedDetailCtrl', function ($scope, $rootScope, $state, $stateParams, $http, $location, $sce, $ionicPopup, $timeout, $cordovaToast, $ionicHistory, $cordovaCamera, ConnectivityMonitor, ReplyService, Upload, ClassifiedService, PluginService, ResponseValidation, MyAds) {

    /* admob should only appear on region, listing and posting pages.*/

    document.addEventListener('deviceready', function (e) {
      // Handle the event...
      if (typeof cordova != 'undefined') {
        PluginService.AdMobService(0, false);
      }
    });

    $scope.pId = $stateParams.pid;

    if (localStorage.getItem("profile")) {
      $scope.profile = JSON.parse(localStorage.getItem('profile'));
    }

    $scope.openBrowser = function (pId) {
      var URL = 'http://www.expatriates.com/cls/' + pId + '.html';
      if ($rootScope.onlineStatus) {
        window.open(URL, '_system', 'location=yes');
      } else {
        ConnectivityMonitor.offlineMessage();
      }
    };

    if ($ionicHistory) {
      $scope.swipBackUrl = $ionicHistory.backView();
    }

    /*
        Function which enable swipe left
    */
    $scope.onSwipeLeft = function (direction) {
      //TODO
    }

    /*
        Function which enable swipe right
    */
    $scope.onSwipeRight = function (direction) {
      if ($scope.swipBackUrl != null && $scope.swipBackUrl != 'null') {
        $location.url($scope.swipBackUrl.url)
      }
    }

    $scope.getPostingDetail = function () {
      var params = {
        pId: $stateParams.pid
      };
      var classified = ClassifiedService.getClassifieds(params);
      classified.then(function (response) {
        try {
          if (response && response.hasOwnProperty('data')) {
            $scope.message = "";
            $scope.classifiedData = response.data;
            $scope.hideStaticData = false;
            $scope.title = $sce.trustAsHtml($scope.classifiedData.posting.display_title);

            localStorage.setItem('postedAd', JSON.stringify($scope.classifiedData));
            localStorage.setItem('currentAd', JSON.stringify($scope.classifiedData));

            $scope.stop = true;
          } else if (response === 'error') {
            $scope.stop = true;
            $state.go("errorPage");
          } else {
            $scope.stop = true;
            $scope.message = "No ads found";
          }
        } catch (e) {}
      });
    }

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
        MyAds.activateAd($stateParams.pid, activateParsers).then(function (response) {
          $timeout(function () {
            dialog.close();
          }, 2000);
          $scope.validationResponse = ResponseValidation.validateResponse(response.httpStatus, response, validationRuleObj);
          if ($scope.validationResponse.validation == true) {
            $state.go('activated');
          } else if (response && response.hasOwnProperty('data') && response.data.action == "sendsmscode") {
            localStorage.setItem('actionType', JSON.stringify(response.data.action));
            $state.go("ActivateSmsOrPhone");

          } else if (response && response.hasOwnProperty('data') && response.data.action == "savephone") {
            localStorage.setItem('actionType', JSON.stringify(response.data.action));
            $state.go("ActivateSmsOrPhone");
          } else {
            $scope.stop = false;
            $scope.errMessage = "Ad could not be activated";
            $scope.showErr = true;
            if (typeof cordova !== 'undefined') {
              $cordovaToast.showLongCenter($scope.errMessage)
                .then(function (success) {
                  // success
                }, function (error) {
                  // error
                });
            } else {
              //alert($scope.errMessage);
            }
          }
        });
      } else {
        ConnectivityMonitor.offlineMessage();
      }
    };

    if ($stateParams.pid != undefined) {
      $scope.getPostingDetail();
    }

    $scope.sendToActivatedAdPage = function () {
      $state.go("activatedAd/:pid", {
        pid: $stateParams.pid
      });
    };

    $scope.sendToModifiedAdPage = function () {
      $state.go("modifyAnAd/:pid", {
        pid: $stateParams.pid
      });
    };

    $scope.goToMyAds = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go("myAds");
      });
    };

    $scope.goToProfile = function () {
      $ionicHistory.clearCache().then(function () {
        $state.go("profile");
      });
    };

  });
