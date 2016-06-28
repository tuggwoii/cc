'use strict';
module.controller('AppController', ['$scope', '$rootScope', '$timeout', '$cookies', '$q', 'AccountService', 'StringService', 'PageService', 'Event',
    function ($scope, $rootScope, $timeout, $cookies, $q, AccountService, StringService, PageService, Event) {

        $scope.init = function () {
            $q.all([
                AccountService.initializeUserOnLoad().then(function () {
                    $rootScope.$broadcast(Event.User.Loaded);
                }),
                StringService.getStrings().success(function (res) {
                    $scope.strings = res;
                })
            ]).then(function () {
                $rootScope.$broadcast(Event.Page.Ready);
                $timeout(function () {
                    $scope.viewReady = true;
                    $timeout(function () {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    }, 200);
                }, 500);
            });
        };

        $scope.navigateTo = function (url) {
            if (url !== window.location.hash) {
                $rootScope.$broadcast(Event.Load.Display);
                $scope.displayLogin = false;
                window.location.hash = url;
            }
        };

        $scope.$on(Event.User.Update, function () {
            $scope.user = window.carcare.user;
            $rootScope.$broadcast(Event.Page.Ready);
        });

        $scope.$on('$includeContentLoaded', function (event) {
           
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            console.log('STATE_CHANGE');
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            console.log('STATE_CHANGE_DONE');
            $rootScope.$broadcast(Event.Load.Dismiss);
        });

        $scope.logout = function () {
            AccountService.logout().then(function () {
                $cookies.remove('Authorization');
                window.location.href = '/';
            }).catch(function () {
                $cookies.remove('Authorization');
                window.location.href = '/';
            });
        };

        $scope.loginToggle = function () {
            $scope.displayLogin = !$scope.displayLogin;
        };

        $scope.init();
}]);
