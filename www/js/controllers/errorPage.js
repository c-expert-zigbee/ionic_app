'use strict';

angular.module('starter')

.controller('ErrorPageCtrl', function($scope, $rootScope, $state, $stateParams, $ionicHistory, SessionService, ConnectivityMonitor) {

        $scope.errorObj =  SessionService.getObject('errorObject');
		$rootScope.toggleMenu = false;
		
		$scope.goToPreviousPage = function(){
			
			$ionicHistory.clearCache().then(function(){ 
				$ionicHistory.goBack();
           	});
		}

		$scope.goToHome =function(){
			$state.go('home');
		}

	

});