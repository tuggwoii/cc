'use strict';
module.controller('DashboardController', ['$scope', '$cookies', '$timeout', 'AccountService', 'NotificationService', 'StringService', function ($scope, $cookies, $timeout, AccountService, NotificationService, StringService) {
    $scope.state = {};
    $scope.user = {};

    $scope.onLoad = function () {
        $scope.state.isReady = false;
        $scope.requestUser();
        $scope.loadString();
    };

    $scope.loadString = function () {
        StringService.getStrings().success(function (response) {
            $scope.strings = response;
        }).error(function () {
            NotificationService.openDialog({
                title: 'error',
                message: 'Can\'t load strings resource'
            });
        });
    };

    $scope.string = function (key, alt) {
        return $scope.strings[key] ? $scope.strings[key] : (alt ? alt : '[' + key + ']');
    };

    $scope.requestUser = function () {
        NotificationService.loading();
        AccountService.me()
            .success(function (response) {
                $scope.user = response.data;
                NotificationService.stopLoading();
            }).error(function () {
                window.location.href = '/login';
            });
    };

    $scope.$on('Ready', function () {
        $scope.state.isReady = true;
    });

    $scope.onLoad();

}]);
