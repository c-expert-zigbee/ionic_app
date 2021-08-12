'use strict';
angular.module('starter').factory('ErrorService', function ($http, $q, $rootScope, $cordovaNetwork, $cordovaToast, $ionicPopup) {
  return {
    errorDialogContent: function (status, data, message) {
      var errorData = {
        data: {}
      };
      switch (status) {
        case 400:
          errorData.data['error'] = data.error;
          errorData.data['status'] = status;
          errorData.data['error_code'] = data.error_code;
          break;
        case 401:
          errorData.data['error'] = data.error;
          errorData.data['status'] = status;
          errorData.data['error_code'] = data.error_code;
          break;
        case 404:
          errorData.data['error'] = "Not Found";
          errorData.data['status'] = status;
          errorData.data['error_code'] = "E0010";
          break;
        case 408:
          errorData.data['error'] = data.error;
          errorData.data['status'] = status;
          errorData.data['error_code'] = data.error_code;
          break;
        case 422:
          errorData.data['error'] = data.error;
          errorData.data['status'] = status;
          errorData.data['error_code'] = data.error_code;
          break;
        case 500:
          errorData.data['error'] = data.error;
          errorData.data['status'] = status;
          errorData.data['error_code'] = data.error_code;
          break;
        case 200:
          errorData.data['error'] = data.error;
          errorData.data['status'] = status;
          errorData.data['error_code'] = data.error_code;
          break;
        default:
          errorData
      }
      return errorData;
    },

    parseErrorContent: function (error, status, header) {
      if ($ionicPopup._popupStack.length > 0) {
        $ionicPopup._popupStack.forEach(function (popup, index) {
          if (popup.isShown === true) {
            var dialog = popup.responseDeferred.promise;
            dialog.close();
          }
        });
      }
      var errorData = {
        data: {},
        hasError: true,
        error: error
      };
      switch (status) {
        case 0:
          errorData.data['errorMessage'] = 'Unable to connect to expatriates.com. Please check your internet connection.';
          errorData.data['status'] = status;
          errorData.data['errorCode'] = '0';
          break;
        case 500:
          errorData.data['errorMessage'] = 'Unable to connect to expatriates.com. Please check your internet connection.';
          errorData.data['status'] = status;
          errorData.data['errorCode'] = '500';
          break;
        case 404:
          errorData.data['errorMessage'] = "Not Found";
          errorData.data['status'] = status;
          errorData.data['errorCode'] = "E0010";
          break;
          /*case 408 :
              errorData.data['errorMessage'] = data.error;
              errorData.data['status'] = status;
              errorData.data['errorCode'] = data.error_code;
              break;
          case 422:
              errorData.data['errorMessage'] = data.error;
              errorData.data['status'] = status;
              errorData.data['errorCode'] = data.error_code;
              break;*/
        default:
          errorData
          /* errorData.data['errorMessage'] = error.error;
           errorData.data['status'] = status;
           errorData.data['errorCode'] = error.error_code;*/
      }
      return errorData;
    },

    composeErrorMessage: function (data) {
      var errors = "";
      var fieldName = "";
      for (var key in data) {
        if (key == 'pattern') {
          for (var index = 0; index < data[key].length; index++) {
            fieldName = data[key][index].$name.replace('_', ' ');
            if (index == data[key].length - 1) {
              errors = errors.concat(fieldName + ' is invalid. ');
            } else if (index == data[key].length - 2) {
              errors = errors.concat(fieldName + ' and ');
            } else {
              errors = errors.concat(fieldName + ' , ');
            }
          }
        }

        if (key == 'required') {
          for (var index = 0; index < data[key].length; index++) {
            if (index == data[key].length - 1) {
              errors = errors.concat(data[key][index].$name + ' is required. ');
            } else if (index == data[key].length - 2) {
              errors = errors.concat(data[key][index].$name + ' and ');
            } else {
              errors = errors.concat(data[key][index].$name + ' , ');
            }
          }
        }
      }
      return errors;
    },

    showErrorMessage: function (toastMessage) {
      if (typeof cordova !== 'undefined') {
        $cordovaToast.showLongCenter(toastMessage).then(function (success) {
          // success
        }, function (error) {
          // error
        });
      } else {
        alert(toastMessage);
      }
    }
  }
});
