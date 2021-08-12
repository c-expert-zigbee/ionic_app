'use strict';

angular.module('starter').controller('ReportCtrl', function($scope,$rootScope,$ionicHistory) {

	$scope.goToClassified = function(){
		$ionicHistory.goBack();
	}
	
});