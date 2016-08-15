'use strict';
module.controller('ShareController', ['$scope', '$q', '$timeout', 'CarService',
    function ($scope, $q, $timeout, CarService) {

        var lightbox = lity();

        $scope.loadShare = function () {
            if ($scope.user_ready) {
                if ($scope.user && $scope.user.id) {
                    $q.all([
                       CarService.get().then(function (res) {
                           $scope.cars = angular.copy(res.data);
                       })
                    ]).then(function () {
                        $scope.displayView();
                    });
                }
                else {
                    $scope.displayView();
                }
            }
            else {
                $timeout(function () {
                    $scope.loadShare();
                }, 200);
            }
        };

        $scope.lightbox = function (url) {
            lightbox(url);
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.loadShare();
        
    }]);
