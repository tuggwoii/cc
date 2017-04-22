'use strict';
module.factory('AccountService', ['$rootScope', '$http', '$q', '$cookies', 'URLS', 'Event', function ($rootScope, $http, $q, $cookies, URLS, Event) {

    var service = 'accounts';
    var userAuthenticationCallback;
    var userAuthenticationReject;
    var facebookResponseFired = false;
    var caches = {};

    function me () {
        return $http.get(URLS.model(service).me);
    }

    function login (model) {
        return $http.post(URLS.model(service).login, model);
    }

    function initUserAuthentication() {
        if ($cookies.get('Authorization')) {
            if (app.debug) {
                console.log('HAS USER COOKIE');
            }
            me().success(function (res) {
                if (app.debug) {
                    console.log('SUCCESS ON GET ME INFO');
                }
                window.carcare.user = res.data;
                $rootScope.$broadcast(Event.User.Update);
                userAuthenticationCallback();
            }).error(function () {
                if (app.debug) {
                    console.error('ERROR ON GET ME INFO');
                }
                $cookies.remove('Authorization');
                userAuthenticationReject();
            });
        }
        else {
            if (app.debug) {
                console.log('NO AUTHENTICATION COOKIE');
            }
            notLoginState();
            userAuthenticationReject();
        }
    }

    function notLoginState () {
        window.carcare.user = {};
    }

    function facebookLogin(creds) {
        login(creds).success(function (res) {
            var date = new Date();
            var expire_date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            $cookies.put('Authorization', res.data.token, { path: '/', expires: expire_date });
            window.carcare.user = res.data;
        }).error(function () {
            notLoginState();
        }).finally(function () {
            userAuthenticationCallback();
        });
    }

    return {
        login: function (model) {
            return login(model);
        },
        register: function (model) {
            return $http.post(URLS.model(service).register, model);
        },
        me: function () {
            return me();
        },
        update: function (model) {
            caches = {};
            return $http.patch(URLS.model(service).update, model);
        },
        delete: function (id) {
            return $q(function (resolve, reject) {
                $http.delete(URLS.model(service).one.replace('{id}', id)).success(function (res) {
                    caches = {};
                    resolve(res);
                }).error(function (err) {
                    reject(err);
                });
            });
        },
        captcha: function () {
            return $http.get(URLS.model(service).captcha);
        },
        logout: function () {
            return $q(function (resolve, reject) {
                FB.getLoginStatus(function (crets) {
                    if (crets.authResponse) {
                        FB.logout(function (response) {
                            //$http.post(URLS.model(service).logout).success(resolve).error(reject);
                        });
                    } else {
                        //$http.post(URLS.model(service).logout).success(resolve).error(reject);
                    }
                });

                $http.post(URLS.model(service).logout).success(resolve).error(reject);
            });
        },
        setAuthenticationToken: function (res) {
            return $q(function (resolve) {
                var date = new Date();
                var expire_date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
                $cookies.put('Authorization', res.data.token, { path: '/', expires: expire_date });
                window.carcare.user = res.data;
                resolve();
            });
        },
        initializeUserOnLoad: function () {
            return $q(function (resolve, reject) {
                userAuthenticationCallback = resolve;
                userAuthenticationReject = reject;
                initUserAuthentication();
            });
        },
        getAll: function (q) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).all + '?p=' + q['p']
                    + (q['q'] ? '&q=' + q['q'] : '')
                    + (q['e'] ? '&e=' + q['e'] : '')
                    + (q['r'] ? '&r=' + q['r'] : '')
                    + (q['o'] ? '&o=' + q['o'] : '')
                    + (q['s'] ? '&s=' + q['s'] : '')
                    ;
                if (caches[key]) {
                    resolve(caches[key]);
                }
                else {
                    $http.get(key).success(function (res) {
                        caches[key] = res;
                        resolve(caches[key]);
                    }).catch(function (res) {
                        reject(res);
                    })
                }
            });
        },
        getById: function (id) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).one.replace('{id}', id);
                if (caches[key]) {
                    resolve(caches[key]);
                }
                else {
                    $http.get(key).success(function (res) {
                        caches[key] = res;
                        resolve(caches[key]);
                    }).catch(function (res) {
                        reject(res);
                    })
                }
            });
        },
        save: function (model) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).admin;
                $http.patch(key, model).success(function (res) {
                    caches = {};
                    caches[key] = res;
                    resolve(caches[key]);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        forgotPassword: function (model) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).forgot_password;
                $http.post(key, model).success(function (res) {
                    resolve(res);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        validateForgotPasswordToken: function (model) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).forgot_password_token;
                $http.post(key, model).success(function (res) {
                    resolve(res);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        changePasswordByToken: function (model) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).change_password_by_token;
                $http.post(key, model).success(function (res) {
                    resolve(res);
                }).catch(function (res) {
                    reject(res);
                });
            });
        },
        AccountService: function (model) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).hijack;
                $http.post(key, model).success(function (res) {
                    resolve(res);
                }).catch(function (res) {
                    reject(res);
                });
            });
        }
    };
}]);
