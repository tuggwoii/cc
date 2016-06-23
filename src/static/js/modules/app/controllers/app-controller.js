'use strict';
module.controller('AppController', ['$scope', '$rootScope', '$timeout', '$cookies', '$q', 'AccountService', 'StringService', 'PageService',
    function ($scope, $rootScope, $timeout, $cookies, $q, AccountService, StringService, PageService) {

        $scope.init = function () {
            $q.all([
                AccountService.initializeUserOnLoad().then(function () {
                    $rootScope.$broadcast('USER_LOADED');
                }),
                StringService.getStrings().success(function (res) {
                    $scope.strings = res;
                })
            ]).then(function () {
                $timeout(function () {
                    $scope.viewReady = true;
                    $timeout(function () {
                        app.footer();
                    }, 200);
                }, 500);
            });
        };

        $scope.navigateTo = function (url) {
            if (url !== window.location.hash) {
                $scope.screenTransition = 'fadeOut';
                $timeout(function () {
                    $scope.screenReady = false;
                    $scope.screenTransition = 'fadeIn';
                }, 200);
                $timeout(function () {
                    window.location.hash = url;
                    $scope.screenReady = true;
                }, 500);
            }
        };

        $scope.$on('UPDATE_USER', function () {
            $scope.user = window.cheepow.user;
        });

        $scope.$on('$includeContentLoaded', function (event) {
           
        });

        $scope.logout = function () {
            AccountService.logout().then(function () {
                $cookies.remove('Authorization');
                window.location.href = '/';
            }).catch(function () {
                alert('ERROR');
            });
        };

        $scope.loginToggle = function () {
            $scope.displayLogin = !$scope.displayLogin;
        };

        $scope.init();
}]);
