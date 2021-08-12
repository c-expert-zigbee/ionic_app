'use strict';

angular.module('starter').service('WebsqlDB', function ($cordovaSQLite, $ionicPlatform, SqlStorageModel) {

    function errorHandler(transaction, error) {
        //console.log('DB Error: ' + error.message + ' code: ' + error.code);
    };

    function successCallBack(transaction, result) {
        //console.log('Data Test - Database success');
    };

    function nullHandler(transaction, result) {
        //console.log('Data Test - Database null' );
    };

    function transactionError(transaction, error) {
        //console.log('DB Error: ' + error.message + ' code: ' + error.code);
        //window.db.close();
    };

    function transactionSuccess(transaction, result) {
        //console.log('Data Test - Database null' );
        //window.db.close();
    };

    function initRunQuery(query, dataArray) {
        if (!window.db) {
            window.db = openDatabase('app.expat', '1.0', 'app.expat', 1048576);
        }
        window.db.transaction(function (tx) {
            tx.executeSql(query, dataArray, nullHandler, errorHandler);
        }, transactionError, transactionSuccess);
    };

	/**
     * method to run query
     */
    this.runQuery = function (query, dataArray, success, error) {

        if (!window.db) {
            window.db = openDatabase('app.expat', '1.0', 'app.expat', 1048576);
        }

        window.db.transaction(function (tx) {
            tx.executeSql(query, dataArray, success, error);
        }, transactionError, transactionSuccess);
    };

	/**
     * method to initialise db
     */
    this.initDB = function () {
        //var data = SqlStorageModel.CacheModel();
        //var queryUrl = data.queryUrl;
        //var response = data.response;

        window.db = false;
        window.db = openDatabase('app.expat', '1.0', 'app.expat', 1048576);

        //var regionTable = "DROP TABLE IF EXISTS regions";
        //var listingTable = "DROP TABLE IF EXISTS listing";

        var regionTable = "CREATE TABLE IF NOT EXISTS regions (id INTEGER PRIMARY KEY AUTOINCREMENT, queryUrl TEXT UNIQUE, response TEXT, created_on DATE DEFAULT NULL)";
        var listingTable = "CREATE TABLE IF NOT EXISTS listing (id INTEGER PRIMARY KEY AUTOINCREMENT, queryUrl TEXT UNIQUE, response TEXT, created_on DATE DEFAULT NULL)";
        var vehiclesTable = "CREATE TABLE IF NOT EXISTS vehicles (id INTEGER PRIMARY KEY AUTOINCREMENT, vehicles TEXT, created_on DATE DEFAULT NULL)";

        var listingTableIndexing = "CREATE INDEX IF NOT EXISTS listingUrlIndex ON listing (queryUrl)";
        var regionTableIndexing = "CREATE INDEX IF NOT EXISTS regionUrlIndex ON regions (queryUrl)";
        var vehiclesTableIndexing = "CREATE INDEX IF NOT EXISTS regionUrlIndex ON vehicles (vehicles)";

        initRunQuery(regionTable, []);
        initRunQuery(listingTable, []);
        initRunQuery(vehiclesTable, []);

        initRunQuery(listingTableIndexing, []);
        initRunQuery(regionTableIndexing, []);
        initRunQuery(vehiclesTableIndexing, []);
    };
});
