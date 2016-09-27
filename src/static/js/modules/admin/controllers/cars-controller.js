'use strict';
module.controller('AdminCarsController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'CarService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, CarService, Event) {

    $scope.params = $location.search();

    $scope.status = {
        loading: false
    };
    $scope.query = {};

    function loadResources() {
        $q.all([
            loadCars()
        ]).then(function () {
            $scope.displayView();
        });
    }


    function isValid() {
        return $scope.user
            && $scope.user.id
            && $scope.user.role.id == 1;
    }

    function loadCars() {
        return $q(function (resolve, reject) {
            CarService.getAll($scope.query).then(function (res) {
                if (app.debug) {
                    console.log('GET CARS', res);
                }
                $scope.model = res.data;
                resolve();
            }).catch(function () {
                reject();
                $rootScope.$broadcast(Event.Message.Display, 'โหลดข้อมูลล้มเหลวกรุณาลองอีกครั้ง');
            });
        })
    }

    $scope.cars = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                loadResources();
            }
            else {
                window.location.href = '/';
            }
        }
        else {
            $timeout(function () {
                $scope.cars();
            }, 1000);
        }
    };

    $scope.search = function () {
        $scope.status.loading = true;
        loadCars().then(function () {
            $scope.status.loading = false;
        });
    };

    $scope.edit = function (car) {
        $scope.navigateTo('#/edit-car?id=' + car.id);
    };

    $scope.delete = function (page) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            CarService.delete(page.name).then(function () {
                loadCars().then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            }).catch(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'ลบรถนี้ไม่ได้กรุณาลองใหม่หรือตรวจสอบให้แน่ใจว่าลบข้อมูลที่เกี่ยวข้องออกทั้งหมดแล้ว');
                }, 500);
            });
        });
    };

    $scope.cars();
}]);
