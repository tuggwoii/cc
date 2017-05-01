'use strict';
module.controller('NotificationController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'NotificationService', 'CarService', 'WorkgroupService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, NotificationService, CarService, WorkgroupService, Event, Helper) {

        $scope.params = $location.search();
        $scope.from_car = $scope.params.car ? true : false;
        if ($scope.from_car) {
            $scope.carId = $scope.params.car;
        }

        function getById() {
            $q.all([
                NotificationService.getById($scope.params.id).then(function (res) {
                    $scope.model = angular.copy(res.data);
                    setInitModel($scope.model);
                }).catch(function () {
                    alert('ERROR LOAD NOTIFICATION');
                }),
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                }),
                WorkgroupService.get().then(function (res) {
                    $scope.workgroup = angular.copy(res.data);
                })
            ]).then(function () {
                $scope.displayView();
                angular.forEach($scope.cars, function (_car) {
                    if (_car.id == $scope.model.for_car) {
                        _car.active = true;
                    }
                });
            });
        }

        function setInitModel(model) {
            if (model.date) {
                var date = new Date(model.date);
                model.date_str = Helper.readableDate(date);
            }
        }

        function isValid() {
            return $scope.params.id && $scope.user && $scope.user.id;
        }

        $scope.notificationPage = function () {
            if ($scope.user_ready) {
                if (isValid()) {
                    getById();
                }
                else {
                    window.location.hash = '#!/';
                }
            }
            else {
                $timeout(function () {
                    $scope.notificationPage();
                }, 200);
            }
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#!/car?id=' + car.id);
        };

        $scope.notificationPage();
    }]);
