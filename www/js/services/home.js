'use strict';
angular.module('starter').service('HomeService', function ($rootScope, $http, $q, $location, SqlService, ConnectivityMonitor, SessionService, StorageService, ErrorService, ConfigService) {

    function checkTimeDifference(created_on) {
        var created_date = new Date(created_on);
        var diff_hour = (new Date() - created_date) / (1000 * 60 * 60);
        var diff_hour_int = Math.ceil(diff_hour);
        if (diff_hour_int > 24) {
            return false;
        } else {
            return true;
        }
    }

    this.getRegionlist = function () {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var queryUrl = address + proxy + '/' + version + '/lookup/regionlist';

        if ($rootScope.onlineStatus) {
            StorageService.getRegion(queryUrl).then(function (result) {
                if (result && result.rows && result.rows.length > 0 && checkTimeDifference(result.rows.item(0).created_on)) {
                    deferred.resolve(JSON.parse(result.rows.item(0).response));
                } else {
                    var httpHeader = ConfigService.getHttpHeader('/lookup/regionlist');
                    $http(httpHeader).success(function (result) {
                        if (result.data && result.data.client_no_cache == 0) {
                            StorageService.saveRegion(queryUrl, JSON.stringify(result));
                        }
                        deferred.resolve(result);
                    }).error(function (e, status, header) {
                        ConnectivityMonitor.offlineMessage();
                        StorageService.getRegion(queryUrl).then(function (result) {
                            if (result && result.rows && result.rows.length > 0) {
                                deferred.resolve(JSON.parse(result.rows.item(0).response));
                            } else {
                                deferred.resolve('error');
                            }
                        });
                    });
                }
            });
        } else {
            StorageService.getRegion(queryUrl).then(function (result) {
                if (result && result.rows && result.rows.length > 0) {
                    deferred.resolve(JSON.parse(result.rows.item(0).response));
                } else {
                    ConnectivityMonitor.offlineMessage();
                    deferred.resolve('error');
                }
            });
        }
        return deferred.promise;
    };

    this.getRegionlistAtSync = function () {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var queryUrl = address + proxy + '/' + version + '/lookup/regionlist';

        if ($rootScope.onlineStatus) {
            var httpHeader = ConfigService.getHttpHeader('/lookup/regionlist');
            $http(httpHeader).success(function (result) {
                if (result.data && result.data.client_no_cache == 0) {
                    StorageService.saveRegion(queryUrl, JSON.stringify(result));
                }
                deferred.resolve(result);
            }).error(function (e, status, header) {
                var errorObj = { "error": e, "status": status, "header": header };
                SessionService.setObject('errorObject', errorObj);
                deferred.resolve('error');
            });
        } else {
            ConnectivityMonitor.offlineMessage();
            deferred.resolve('error');
        }
        return deferred.promise;
    };

    this.getRegionHighlightList = function () {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var queryUrl = address + proxy + '/' + version + '/lookup/regionhighlight';

        if ($rootScope.onlineStatus) {
            StorageService.getRegion(queryUrl).then(function (result) {
                if (result && result.rows && result.rows.length > 0 && checkTimeDifference(result.rows.item(0).created_on)) {
                    deferred.resolve(JSON.parse(result.rows.item(0).response));
                } else {
                    var httpHeader = ConfigService.getHttpHeader('/lookup/regionhighlight');
                    $http(httpHeader).success(function (result) {
                        if (result.data && result.data.client_no_cache == 0) {
                            StorageService.saveRegion(queryUrl, JSON.stringify(result));
                        }
                        deferred.resolve(result);
                    }).error(function (e, status, header) {
                        ConnectivityMonitor.offlineMessage();
                        StorageService.getRegion(queryUrl).then(function (result) {
                            if (result && result.rows && result.rows.length > 0) {
                                deferred.resolve(JSON.parse(result.rows.item(0).response));
                            } else {
                                deferred.resolve('error');
                            }
                        });
                    });
                }
            });
        } else {
            StorageService.getRegion(queryUrl).then(function (result) {
                if (result && result.rows && result.rows.length > 0) {
                    deferred.resolve(JSON.parse(result.rows.item(0).response));
                } else {
                    ConnectivityMonitor.offlineMessage();
                    deferred.resolve('error');
                }
            });
        }
        return deferred.promise;
    };

    this.getRegionHighlightListAtSync = function () {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var queryUrl = address + proxy + '/' + version + '/lookup/regionhighlight';

        if ($rootScope.onlineStatus) {
            var httpHeader = ConfigService.getHttpHeader('/lookup/regionhighlight');
            $http(httpHeader).success(function (result) {
                if (result.data && result.data.client_no_cache == 0) {
                    StorageService.saveRegion(queryUrl, JSON.stringify(result));
                }
                deferred.resolve(result);
            }).error(function (e, status, header) {
                var errorObj = { "error": e, "status": status, "header": header };
                SessionService.setObject('errorObject', errorObj);
                deferred.resolve('error');
            });
        } else {
            ConnectivityMonitor.offlineMessage();
            deferred.resolve('error');
        }
        return deferred.promise;
    };

    this.getAllCategoryList = function () {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var queryUrl = address + proxy + '/' + version + '/classifieds/all/category';
        if ($rootScope.onlineStatus) {
            StorageService.getRegion(queryUrl).then(function (result) {
                if (result && result.rows && result.rows.length > 0 && checkTimeDifference(result.rows.item(0).created_on)) {
                    deferred.resolve(JSON.parse(result.rows.item(0).response));
                } else {
                    var httpHeader = ConfigService.getHttpHeader('/classifieds/all/category');
                    $http(httpHeader).success(function (result) {
                        if (result.data && result.data.client_no_cache == 0) {
                            StorageService.saveRegion(queryUrl, JSON.stringify(result));
                        }
                        deferred.resolve(result);
                    }).error(function (e, status, header) {
                        ConnectivityMonitor.offlineMessage();
                        StorageService.getRegion(queryUrl).then(function (result) {
                            if (result && result.rows && result.rows.length > 0) {
                                deferred.resolve(JSON.parse(result.rows.item(0).response));
                            } else {
                                deferred.resolve('error');
                            }
                        });
                    });
                }
            });
        } else {
            StorageService.getRegion(queryUrl).then(function (result) {
                if (result && result.rows && result.rows.length > 0) {
                    deferred.resolve(JSON.parse(result.rows.item(0).response));
                } else {
                    ConnectivityMonitor.offlineMessage();
                    deferred.resolve('error');
                }
            });
        }
        return deferred.promise;
    };

    this.getAllCategoryListAtSync = function () {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        if ($rootScope.onlineStatus) {
            var queryUrl = address + proxy + '/' + version + '/classifieds/all/category';
            var httpHeader = ConfigService.getHttpHeader('/classifieds/all/category');
            $http(httpHeader).success(function (result) {
                if (result.data && result.data.client_no_cache == 0) {
                    StorageService.saveRegion(queryUrl, JSON.stringify(result));
                }
                deferred.resolve(result);
            }).error(function (e, status, header) {
                var errorObj = { "error": e, "status": status, "header": header };
                SessionService.setObject('errorObject', errorObj);
                deferred.resolve('error');
            });
        } else {
            ConnectivityMonitor.offlineMessage();
            deferred.resolve('error');
        }
        return deferred.promise;
    };

    this.getSearchRegionList = function (params) {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData = JSON.parse(localStorage.getItem("sessionData"));

        if ($rootScope.onlineStatus) {
            $http({
                method: 'POST',
                url: address + proxy + '/' + version + '/search', //url: address+url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'PROJECT_KEY': "",
                    'ACCESS_KEY': sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : '',
                    'API_KEY': sessionData !== null && sessionData.api_key !== undefined ? sessionData.api_key : ''
                },
                data: params,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (e, status, header) {
                var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        } else {
            ConnectivityMonitor.offlineMessage();
            deferred.resolve('error');
        }
        return deferred.promise;
    };


    this.getNextSearchRegionList = function (params) {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData = JSON.parse(localStorage.getItem("sessionData"));
        if ($rootScope.onlineStatus) {
            $http({
                method: 'GET',
                url: address + params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'PROJECT_KEY': "",
                    'ACCESS_KEY': sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : '',
                    'API_KEY': sessionData !== null && sessionData.api_key !== undefined ? sessionData.api_key : ''
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (e, status, header) {
                var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        } else {
            ConnectivityMonitor.offlineMessage();
            deferred.resolve('error');
        }
        return deferred.promise;
    };

    this.getAdsList = function () {
        var deferred = $q.defer();
        if ($rootScope.onlineStatus) {
            var httpHeader = ConfigService.getHttpHeader('/listing/limit=1000');
            $http(httpHeader).success(function (result) {
                deferred.resolve(result);
            }).error(function (e, status, header) {
                var errorData = ErrorService.parseErrorContent(e, status, header);
                SessionService.setObject('errorObject', errorData);
                deferred.reject;
                $location.url('/errorPage');
            });
        } else {
            ConnectivityMonitor.offlineMessage();
            deferred.resolve('error');
        }
        return deferred.promise;
    }

    this.getVehiclelist = function () {
        var deferred = $q.defer();
        if ($rootScope.onlineStatus) {
            StorageService.getVehicles().then(function (result) {
                if (result && result.rows && result.rows.length > 0 && checkTimeDifference(result.rows.item(0).created_on)) {
                    deferred.resolve(JSON.parse(result.rows.item(0).response));
                } else {
                    var httpHeader = ConfigService.getHttpHeader('/lookup/vehiclelist');
                    $http(httpHeader).success(function (result) {
                        if (result.data && result.data.client_no_cache == 0) {
                            StorageService.saveVehicles(JSON.stringify(result.data.vehicles));
                        }
                        deferred.resolve(result.data.vehicles);
                    }).error(function (e, status, header) {
                        ConnectivityMonitor.offlineMessage();
                        StorageService.getRegion(queryUrl).then(function (result) {
                            if (result && result.rows && result.rows.length > 0) {
                                deferred.resolve(JSON.parse(result.rows.item(0).response));
                            } else {
                                deferred.resolve('error');
                            }
                        });
                    });
                }
            });
        } else {
            StorageService.getVehicles().then(function (result) {
                if (result && result.rows && result.rows.length > 0) {
                    deferred.resolve(JSON.parse(result.rows.item(0).response));
                } else {
                    ConnectivityMonitor.offlineMessage();
                    deferred.resolve('error');
                }
            });
        }
        return deferred.promise;
    };
});
