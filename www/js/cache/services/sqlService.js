
'use strict';
angular.module('starter').service('SqlService', function ($cordovaSQLite, $ionicPlatform, $q, SqlStorageModel, WebsqlDB) {

	/**
     * method to get all table of current db
     */
    this.getALlTable = function () {
        var deferred = $q.defer();
        var query = "SELECT * FROM sqlite_master WHERE type = 'table'";
        WebsqlDB.runQuery(query, [], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    }

	/**
     * method to drop table
     */
    this.dropTable = function (tableName) {
        var deferred = $q.defer();
        var query = 'DROP TABLE IF EXISTS tableName';
        WebsqlDB.runQuery(query, [], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to get all region data
     */
    this.getAllRegionData = function () {
        var deferred = $q.defer();
        var query = "SELECT * from regions";
        WebsqlDB.runQuery(query, [], function (transaction, response) {
            //Success Callback
            deferred.resolve(transaction, response);
        }, function (error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to get all listing urls
     */
    this.getAllListingQueryUrls = function () {
        var deferred = $q.defer();
        var query = "SELECT queryUrl from listing";
        WebsqlDB.runQuery(query, [], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to get all region urls
     */
    this.getAllRegionQueryUrls = function () {
        var deferred = $q.defer();
        var query = "SELECT queryUrl from regions";
        WebsqlDB.runQuery(query, [], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to get data by listing queryUrl
     */
    this.getDataByListingQueryUrl = function (queryUrl) {
        var deferred = $q.defer();
        var query = "SELECT * from listing WHERE queryUrl = ?";
        WebsqlDB.runQuery(query, [queryUrl], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to get data by region queryUrl
     */
    this.getDataByRegionQueryUrl = function (queryUrl) {
        var deferred = $q.defer();
        var query = "SELECT * from regions WHERE queryUrl = ?";
        WebsqlDB.runQuery(query, [queryUrl], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to add new listing data
     */
    this.addNewListingData = function (queryUrl, response) {
        var dateNow = new Date();
        var deferred = $q.defer();
        var query = "INSERT OR REPLACE INTO listing (queryUrl, response, created_on) VALUES (?,?,?)";
        WebsqlDB.runQuery(query, [queryUrl, response, dateNow], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to add new region data
     */
    this.addNewRegionData = function (queryUrl, response) {
        var dateNow = new Date();
        var deferred = $q.defer();
        var query = "INSERT OR REPLACE INTO regions (queryUrl, response, created_on) VALUES (?,?,?)";
        WebsqlDB.runQuery(query, [queryUrl, response, dateNow], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to delete data
     */
    this.deleteData = function (queryUrl) {
        var deferred = $q.defer();
        var query = "DELETE FROM listing WHERE queryUrl = ?";
        WebsqlDB.runQuery(query, [queryUrl], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to delete data by REGEXP
     */
    this.deleteDataByRegexp = function (queryUrlRegexp) {
        var deferred = $q.defer();
        var query = "DELETE FROM listing WHERE queryUrl LIKE ?";
        WebsqlDB.runQuery(query, ["%" + queryUrlRegexp + "%"], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    }

	/**
     * method to add new listing data
     */
    this.addVehiclesData = function (vehicles) {
        var dateNow = new Date();
        var deferred = $q.defer();
        var query = "INSERT OR REPLACE INTO vehicles (vehicles, created_on) VALUES (?,?)";
        WebsqlDB.runQuery(query, [vehicles, dateNow], function (transaction, response) {
            //Success Callback
            deferred.resolve(response);
        }, function (transaction, error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };

	/**
     * method to get all vehicles
     */
    this.getVehiclesData = function () {
        var deferred = $q.defer();
        var query = "SELECT vehicles from vehicles";
        WebsqlDB.runQuery(query, [], function (transaction, response) {
            //Success Callback
            deferred.resolve(transaction, response);
        }, function (error) {
            //Error Callback
            deferred.reject(error);
        });
        return deferred.promise;
    };
});
