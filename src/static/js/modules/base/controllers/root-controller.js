'use strict';
module.controller('RootController', ['$scope', 'NotificationService', function ($scope, NotificationService) {

    $scope.state = { };

    $scope.onLoad = function () {
        $scope.state.isReady = false;
        NotificationService.loading();
    };

    $scope.$on('Ready', function () {
        $scope.state.isReady = true;
    });

    $scope.onLoad();

}]);
