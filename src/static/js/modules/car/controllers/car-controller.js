'use strict';
module.controller('CarController', ['$scope', '$rootScope', '$timeout', '$q', 'CarService', 'Event',
    function ($scope, $rootScope, $timeout, $q, CarService, Event) {

        $scope.init = function () {
            $q.all([
                CarService.get().success(function (res) {
                    $scope.cars = res.data;
                }).error(function () {

                })
            ]).then(function () {
                
            });
        };

        $scope.$on(Event.Page.Ready, $scope.init);
        $scope.init();
    }]);
