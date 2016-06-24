'use strict';
module.controller('CarController', ['$scope', '$rootScope', '$timeout', '$q', 'CarService',
    function ($scope, $rootScope, $timeout, $q, CarService) {

        $scope.init = function () {
            $q.all([
                CarService.get().success(function (res) {
                    $scope.cars = res.data;
                }).error(function () { })
            ]).then(function () {
                
            });
        };

        $scope.$on('READY', $scope.init);
        $scope.init();
    }]);
