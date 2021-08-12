'use strict';

angular.module('starter')

.controller('ProfileCtrl', function($scope, $rootScope,$ionicModal, $state,$http,$location,Profile,$ionicPopup, $cordovaToast, $q, $cordovaCamera, RegionService, ConnectivityMonitor, PluginService, Upload, ResponseValidation, $ionicScrollDelegate) {

	$rootScope.toggleMenu = false;
	var address = sessionStorage.getItem('address');
	var proxy =   sessionStorage.getItem('proxy');
	var version = sessionStorage.getItem('version');

    /* Issue #112  admob should only appear on region, listing and posting pages.*/
    document.addEventListener('deviceready', function(e){
        // Handle the event...
        if(typeof cordova != 'undefined'){
            PluginService.AdMobService(0, false);
        }
    });

    $scope.profile_picture_current = "img/menu-icons/noun_919803_cc.png";
    $scope.profileModal = $ionicModal.fromTemplateUrl('profile-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(profileModal) {
      $scope.profileModal = profileModal;
    });

    $scope.openProfileModal = function() {
      $scope.profileModal.show();
    };

    $scope.closeProfileModal = function() {
      $scope.profileModal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        if ($scope.profileModal) {
            $scope.profileModal.hide();
        }
    });
    // Execute action on hide modal
    $scope.$on('profileModal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('profileModal.removed', function() {
      // Execute action
    });
    $scope.$on('profileModal.shown', function() {
    });

	$scope.goToSelectedCountry = function(region_id){
		$location.hash(region_id);
		$ionicScrollDelegate.anchorScroll();
    }

    $scope.addNewImage =function(data){
        // /eapi/v1/authentication/updateprofilepicture
        var address = sessionStorage.getItem('address');
        var proxy =   sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData =  JSON.parse(localStorage.getItem("sessionData"));
        $scope.obj = {"profile_picture" : data};
        Upload.upload({
            url: address+proxy+'/'+version+'/authentication/updateprofilepicture',
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded',
                      'PROJECT_KEY' :  project_key,
                      'ACCESS_KEY'  :  sessionData.access_key,
                      'API_KEY'     :  sessionData.api_key
                     },
            data: $scope.obj
        }).success(function(result){

        }).error(function(e){

        });
    };

    $scope.getPicture = function () {
        var options = {
            quality : 100,
            sourceType: 0,
            destinationType : 0,
            encodingType: 0,
            mediaType: 0
        };
        if(typeof cordova !== 'undefined'){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.profile_picture_current = undefined;
                $scope.profile_picture_current = "data:image/jpeg;base64," + imageData;
                $scope.profile_picture = Upload.dataUrltoBlob("data:image/jpeg;base64," + imageData, 'profile_picture');
                $scope.addNewImage($scope.profile_picture);
            }, function(err) {
            });
        }
    };

    $scope.takePicture = function () {
        var options = {
             quality : 100,
             sourceType: 1,
             destinationType : 1,
             encodingType: 0,
             mediaType: 0
        };

        if(typeof cordova !== 'undefined'){
            $cordovaCamera.getPicture(options).then(function(filePath) {
                $scope.profile_picture_current = undefined;
                $scope.profile_picture_current = filePath;
                Upload.urlToBlob(filePath).then(function(blob) {
                    $scope.profile_picture = blob;
                    $scope.addNewImage($scope.profile_picture);
                });
            }, function(err) {
            });
        }
        
    };

    $scope.goToMyAds = function(){
        $state.go("myAds");
    };

    $scope.editProfile = function(){
        $state.go("profileEdit");
    };

    $scope.backToProfile = function(){
        $state.go("profile");
    };

    if(localStorage.getItem("sessionData")){
        $scope.sessionData = JSON.parse(localStorage.getItem("sessionData"));
    }

    if (localStorage.getItem("profile")) {
        $scope.profile = JSON.parse(localStorage.getItem('profile'));
        localStorage.setItem("currency", $scope.profile.currency);
        localStorage.setItem("currentSelectionRegion", JSON.stringify({currency_code : $scope.profile.currency, name : $scope.profile.region_name, region_id : $scope.profile.region_id}));
        if(!$scope.profile.type || !$scope.profile.type == ''){
            $scope.profile.type = $scope.profile.type
        }
    } else {
        $scope.profile = {};
        $scope.profile.type = 'Private';
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
        if ($scope.profile.region_id) {
            $scope.goToSelectedCountry($scope.profile.region_id);
        }
    };

    $scope.selectRegion = function(countryOrCity,currency) {
        $scope.countryOrCity = countryOrCity;
        $scope.profile.region_id =  countryOrCity.region_id;
        $scope.profile.region_name = countryOrCity.name;
        localStorage.setItem("currentSelectionRegion", JSON.stringify(countryOrCity));
        localStorage.setItem("currency", currency);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
    // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
    // Execute action
    });

    $scope.locations = JSON.parse(localStorage.getItem('regions'));
    $scope.regions = $scope.locations.continents;
    $scope.countryList = _.pluck($scope.regions, 'countries' );
        
    $scope.countryListArray = [].concat.apply([], $scope.countryList);

    $scope.countryList = function(){
        var address = sessionStorage.getItem('address');
        var proxy =   sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        $http({method: 'GET',
            url: address+proxy+'/'+version+'/lookup/countrylist',
            data: $scope.dataObj,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).success(function(result){
            $scope.locations = result.data.region.country;
        }).error(function(e){
        });
    }

    $scope.selectedRegion = function(data){
        localStorage.setItem("currentSelectionRegion", JSON.stringify(data));
    };

	$scope.getProfile = function(){
		$scope.submitted = true;
		if (!profilepage.$valid) {
            $scope.stop = true;
			$scope.submitted = false;
            Profile.getProfile().then(function(response){
                $scope.stop = false;
                localStorage.setItem('profile',JSON.stringify(response.data.profile));
                $scope.profile = response.data.profile;
                $scope.msg = 'Profile successfully updated.';
                if(typeof cordova !== 'undefined'){
                    $cordovaToast.showLongCenter($scope.msg)
                        .then(function(success) {
                          // success
                          $state.go('profile');
                        }, function (error) {
                          // error
                    });
                }else{
                    alert($scope.msg);
                }
                localStorage.setItem("currency", $scope.profile.currency);
                localStorage.setItem("currentSelectionRegion", JSON.stringify({currency_code : $scope.profile.currency, name : $scope.profile.region_name, region_id : $scope.profile.region_id}));
            });
		}
	}

    $scope.profileUpdate = function(profilepage,profile){
        if ($rootScope.onlineStatus) {
            if (profilepage.$valid) {
                $scope.stop = true;
                $scope.profileObj = {
                    "firstname" : profile.first_name,
                    "lastname"  : profile.last_name,
                    "company"   : profile.company_name,
                    "phone"     : profile.phone != 'null' ? profile.phone : '',
                    "region"    : profile.region_id+'-'+profile.region_name,
                    "language"  : profile.language,
                    "type"      : profile.type,  
                    "todo"      :"successmodify"       
                }
                Profile.updateProfile($scope.profileObj).then(function(response){
                    if (response.status == 200 && response.data.hasOwnProperty('updateprofile') && response.data.updateprofile == "Success") {
                        $scope.showMsg = true;
                        $scope.stop = false;
                        $scope.getProfile();
                    } else if (response.status == 422 && response.data.hasOwnProperty('error') && response.data.error == 'Authentication failed'){
                        if(ResponseValidation.logout()){
                            ConnectivityMonitor.authenticationFailedMessage();
                            $state.go('signIn');
                        }
                    } else {   
                        $scope.msg = 'Profile could not be updated.';
                        $scope.showMsg = true;
                        $scope.stop = false;
                        if (typeof cordova !== 'undefined') {
                            $cordovaToast.showLongCenter($scope.msg)
                                .then(function(success) {
                                  // success
                                }, function (error) {
                                  // error
                            });
                        } else {
                            alert($scope.msg);
                        }
                    }
                   
                });
            } else {
                $scope.submitted = true;
                var errors = [];
                for (var key in profilepage.$error) {
                    for (var index = 0; index < profilepage.$error[key].length; index++) {
                        errors.push(profilepage.$error[key][index].$name + ' is required.');
                    }
                }
                if (typeof cordova !== 'undefined') {
                    $cordovaToast.showLongCenter(errors.toString())
                        .then(function(success) {
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
    };

    $scope.currrentCheckboxSelection = function(value, event) {
        if (event.currentTarget.checked == true) {
            event.preventDefault();
        } else {
            $scope.profile.type = value;
        }
    };
});