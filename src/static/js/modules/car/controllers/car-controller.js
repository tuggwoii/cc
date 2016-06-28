'use strict';
module.controller('CarController', ['$scope', '$rootScope', '$timeout', '$q', 'CarService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, CarService, Event, Helper) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.process = [];

        $scope.init = function () {
            $scope.process = [];
            $scope.process.push($scope.getAll());
            $q.all($scope.process).then(function () {
                
            });
        };

        $scope.getAll = function () {
            CarService.get().then(function (res) {
                $scope.cars = res.data;
            }).catch(function () {

            })
        };

        $scope.add = function () {
            $rootScope.$broadcast(Event.Load.Display);
            $scope.status = {};
            CarService.create($scope.model).success(function () {
                $scope.navigateTo('#/');
            }).error(function (res) {
                if (res.error.message === 'MAX CAR') {
                    $scope.status.maxcar = true;
                }
                else {
                    $scope.status.error = true;
                }
                $rootScope.$broadcast(Event.Load.Dismiss);
                
            });
        };


        $scope.$on(Event.Page.Ready, function () {
            $scope.init();
        });

        $scope.init();

}]);
