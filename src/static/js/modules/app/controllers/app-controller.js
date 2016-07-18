'use strict';
module.controller('AppController', ['$scope', '$rootScope', '$timeout', '$cookies', '$q', 'AccountService', 'StringService', 'PageService', 'Event', 'FileService', 'WorkgroupService', 'CarService',
    function ($scope, $rootScope, $timeout, $cookies, $q, AccountService, StringService, PageService, Event, FileService, WorkgroupService, CarService) {

        $scope.init = function () {
            $q.all([
                AccountService.initializeUserOnLoad().then(function () {
                    $rootScope.$broadcast(Event.User.Loaded);
                }),
                StringService.getStrings().success(function (res) {
                    $scope.strings = res;
                }),
                WorkgroupService.get().then(function (res) {
                    $scope.workgroup = res;
                }),
                CarService.get().then(function (res) {
                    $scope.cars = res.data;
                })
            ]).then(function () {
                $rootScope.$broadcast(Event.Page.Ready);
                $timeout(function () {
                    $scope.viewReady = true;
                    $timeout(function () {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                    }, 200);
                }, 500);
            }).catch(function () {
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
                $rootScope.$broadcast(Event.Load.Display, 'PAGE_CHANGE');
                $scope.displayLogin = false;
                window.location.hash = url;
            }
        };

        $scope.upload = function (files) {
            $scope.uploading = true;
            FileService.upload(files[0]).then(function (file) {
                $rootScope.$broadcast(Event.File.Success, file);
                $scope.uploading = false;
                $scope.uploadSave = true;
                $timeout(function () {
                    $scope.uploadSave = false;
                }, 50000)
            }).catch(function () {

            });
        };

        $scope.$on(Event.User.Update, function () {
            $scope.user = window.carcare.user;
            $rootScope.$broadcast(Event.Page.Ready);
        });

        $scope.$on(Event.Car.Clear, function () {
            angular.forEach($scope.cars, function (c) {
                c.active = false;
            });
        });

        $scope.$on(Event.Car.Update, function (event, cars) {
            $scope.cars = cars;
        });

        $scope.$on(Event.Car.SetActive, function (event, id) {
            angular.forEach($scope.cars, function (c) {
                if (c.id == id) {
                    c.active = true;
                }
                else {
                    c.active = false;
                }
            });
        });

        $scope.$on('$includeContentLoaded', function (event) {
           
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.$broadcast(Event.Load.Dismiss, 'PAGE_CHANGE');
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

        $scope.$watch(function () {
            return location.hash
        }, function (value) {
            if (location.hash.indexOf('notification') > -1 || location.hash.indexOf('repair') > -1 || location.hash.indexOf('shares') > -1) {
                $scope.mainClass = 'opacity-theme';
            }
            else {
                $scope.mainClass = '';
            }
            if (!location.hash || location.hash == '/#/' || location.hash == '#/') {
                $scope.isHomePage = true;
                $scope.isSharePage = false;
            }
            else if (location.hash.indexOf('shares') > -1) {
                $scope.isHomePage = false;
                 $scope.isSharePage = true;
            }
            else {
                $scope.isSharePage = false;
                $scope.isHomePage = false;
            }
        });

        $scope.init();
}]);
