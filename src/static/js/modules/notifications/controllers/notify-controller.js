'use strict';
module.controller('NotifyController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.model = {};

    $scope.$on('OpenNotify', function (event, model) {
        $scope.model = model;
        if (!model) {
            $scope.model = {};
        }
        if (!$scope.model.title) {
            $scope.model.title = $scope.strings['error_header'];
        }
        if (!$scope.model.message) {
            $scope.model.message = $scope.strings['error_general'];
        }
        if (!$scope.model.type) {
            $scope.model.type = 'success';
        }
        $scope.model.isShow = true;

        $timeout($scope.close, 8000);
    });

    $scope.close = function () {
        $scope.model.isShow = false;
    };

    $scope.reload = function () {
        window.location.reload();
    };

}]);
