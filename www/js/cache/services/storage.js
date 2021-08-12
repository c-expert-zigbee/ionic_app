
'use strict';
angular.module('starter').service('StorageService', function ($cordovaSQLite, $ionicPlatform, $q, SqlService) {

	/**
     * method to save region cache
     */
    this.saveRegion = function (queryUrl, response) {
        var save = SqlService.addNewRegionData(queryUrl, response);
    };

	/**
     * method to get region cache
     */
    this.getRegion = function (queryUrl) {
        var data = SqlService.getDataByRegionQueryUrl(queryUrl);
        return data;
    };

	/**
     * method to save listing cache
     */
    this.saveListing = function (queryUrl, response) {
        var res = JSON.parse(response);
        if (res && res.data && res.data.list.length > 0) {
            var save = SqlService.addNewListingData(queryUrl, response);
        }
    };

	/**
     * method to get listing cache
     */
    this.getListing = function (queryUrl) {
        var data = SqlService.getDataByListingQueryUrl(queryUrl);
        return data;
    };

	/**
     * method to get all listing urls cache
     */
    this.getAllListingUrls = function () {
        var data = SqlService.getAllListingQueryUrls();
        return data;
    };

	/**
     * method to get all Region urls cache
     */
    this.getAllRegionUrls = function () {
        var data = SqlService.getAllRegionQueryUrls();
        return data;
    };

    this.removeByRegexp = function (queryUrlRegexp) {
        var data = SqlService.deleteDataByRegexp(queryUrlRegexp);
        return data;
    };

	/**
     * method to remove cache
     */
    this.remove = function (queryUrl) {
        var data = SqlService.deleteData(queryUrl);
        return data;
    };

    this.drop = function (id) {
        var data = SqlService.dropTable();
    };

	/**
     * method to update cache
     */
    this.update = function (id) {
        //TODO
    };

	/**
     * method to get vehicles cache
     */
    this.getVehicles = function () {
        var data = SqlService.getVehiclesData();
        return data;
    };

	/**
     * method to save vehicles cache
     */
    this.saveVehicles = function (vehicles) {
        var save = SqlService.addVehiclesData(vehicles);
    };

});
