'use strict';
module.controller('ConfirmController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.model = {};

    $scope.$on('OpenConfirm', function (event, callback) {
        $scope.callback = callback;
        $scope.model.isShow = true;
    });

    $scope.close = function () {
        $scope.model.isShow = false;
    };

    $scope.confirm = function () {
        $scope.callback();
        $scope.model.isShow = false;
    };

}]);
