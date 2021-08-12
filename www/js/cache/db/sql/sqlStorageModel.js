'use strict';

angular.module('starter').service('SqlStorageModel', function(StorageModel) {

	/*
	    sql model for caching data
	*/

	this.CacheModel = function() {
	    var data = StorageModel.Cache("queryUrl TEXT UNIQUE","response TEXT")
	    return data;
	};
	
});