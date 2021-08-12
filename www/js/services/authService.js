
'use strict';

angular.module('starter').factory('CacheService', function ($rootScope, $http, $location, SessionService) {

    var user = { token: '', email: '', firstName: '', lastName: '' }

    var cacheSession = function (response) {
        SessionService.set('authenticated', true);
        user = {
            token: response.token,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            pictureUrl: response.pictureUrl,
            roles: response.roles
        };

        SessionService.setUser(user);
    };


    var uncacheSession = function () {
        var user = SessionService.getUser
        SessionService.unset('authenticated');
        SessionService.unset('projects' + user.token);
        $rootScope.showBuser = 'false';
        SessionService.unsetUser();

        $location.path('/');
    };

    return {
        uncacheSession: uncacheSession,
        cacheSession: cacheSession
    }
});
angular.module('starter').factory('SessionService', function ($http, $location, $rootScope) {
    return {
        get: function (key) {
            return localStorage.getItem(key);
        },
        set: function (key, val) {
            return localStorage.setItem(key, val);
        },
        unset: function (key) {
            return localStorage.removeItem(key);
        },
        setUser: function (val) {
            return localStorage.setItem('user', JSON.stringify(val));
        },
        getUser: function () {
            return JSON.parse(localStorage.getItem('user'));

        },
        unsetUser: function () {
            return localStorage.removeItem('user');
        },

        setObject: function (key, val) {
            return localStorage.setItem(key, JSON.stringify(val));
        },
        getObject: function (key) {
            return JSON.parse(localStorage.getItem(key));

        },
        unsetObject: function (key) {
            return localStorage.removeItem(key);
        }

    };
});
angular.module('starter').factory('AuthenticationService', function ($rootScope, $http, $q, $location, SessionService, CacheService, $state, ErrorService) {

    //--------------module scope variables -------------------

    var isLogged, login, logout, register, checkLoginStatus;
    // ------------------ Cache Methods ----------------------------

    var showError = function (response) {
        //flash.error = response.message;
    };
    // ------------------ End of Cache Methods ---------------------
    // ------------------ Service Methods --------------------------
    //    This a is the authentication method. You pass the username/password
    //    and sets the isLogged to true if it was the correct combination
    //
    login = function (credentials) {
        // TODO Rework this with resource instead of http.post
        var address = sessionStorage.getItem('address');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData = JSON.parse(localStorage.getItem("sessionData"));
        var userLogin = $http({
            method: 'POST',
            url: address + 'users/login',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'PROJECT_KEY': project_key,
                'ACCESS_KEY': sessionData !== null && sessionData.access_key !== undefined ? sessionData.access_key : '',
                'API_KEY': sessionData !== null && sessionData.api_key !== undefined ? sessionData.api_key : ''
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: credentials
        });
        userLogin.success(function (response) {

            if (response.hasOwnProperty('token')) {
                userLogin.success(CacheService.cacheSession);
            }
            else {
                //TODO
            }
        }).error(function (err) {

            //alert(err)
        });
        return userLogin;
    };

    isLogged = function () {
        return SessionService.get('authenticated');
    };
    //    This a is the logout method. Calling this method will set the isLogged to false.
    //
    logout = function () {

        //var logout = CacheService.uncacheSession;
        return CacheService.uncacheSession();
    };

    checkLoginStatus = function () {
        var deferred = $q.defer();
        var address = sessionStorage.getItem('address');
        var proxy = sessionStorage.getItem('proxy');
        var version = sessionStorage.getItem('version');
        var project_key = sessionStorage.getItem('project_key');
        var sessionData = JSON.parse(localStorage.getItem("sessionData"));
        if ($rootScope.onlineStatus) {
            $http({
                method: 'POST',
                url: address + proxy + '/' + version + "/authentication/myads?page=1",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'PROJECT_KEY': project_key,
                    'ACCESS_KEY': sessionData.access_key,
                    'API_KEY': sessionData.api_key
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
            deferred.resolve('error');
        }
        return deferred.promise;
    };

    // ------------------ end of Service Methods --------------------
    // ------------------ Public Methods ----------------------------
    // ------------------ end of Public Methods ---------------------
    //return methods of the module
    return {
        login: login,     //the log in method
        logout: logout,    // the log out method
        isLogged: isLogged,
        register: register,
        checkLoginStatus: checkLoginStatus,
    };
});
