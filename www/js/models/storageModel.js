'use strict';
angular.module('starter').service('StorageModel', function() {

	/*
	    model for caching data

	*/

    var CacheModel =  {
	  constructor : function(queryUrl, response) {
	    this.queryUrl   = queryUrl;
	    this.response   = response;
	    return this;
	  }
	};

	this.Cache = function(queryUrl,response) {
	    var data = CacheModel.constructor(queryUrl,response);
	    return data;
	};


});