'use strict';
module.controller('LoadingController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.model = {};

    $scope.$on('Loading', function () {
        $scope.model.isShow = true;
    });

    $scope.$on('StopLoading', function () {
        $timeout(function () {
            $scope.model.isShow = false;
        }, 500);
    });

}]);
