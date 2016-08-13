'use strict';
module.controller('ShareController', ['$scope', '$q', 'CarService',
    function ($scope, $q, CarService) {

        var lightbox = lity();

        $scope.loadShare = function () {
            $q.all([
               CarService.get().then(function (res) {
                   $scope.cars = angular.copy(res.data);
               })
            ]).then(function () {
                $scope.displayView();
            });
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
