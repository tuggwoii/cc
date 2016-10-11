'use strict';
module.controller('AdminPaymentController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'PaymentService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, PaymentService, Event) {

    $scope.params = $location.search();

    $scope.status = {
        loading: false
    };
    $scope.query = {};

    function loadResources() {
        $q.all([
            load()
        ]).then(function () {
            $scope.displayView();
        });
    }


    function isValid() {
        return $scope.user
            && $scope.user.id
            && $scope.user.role.id == 1;
    }

    function load() {
        return $q(function (resolve, reject) {
            PaymentService.getAll($scope.query).then(function (res) {
                if (app.debug) {
                    console.log('GET PAYMENTS', res);
                }
                $scope.model = res.data;
                resolve();
            }).catch(function () {
                reject();
                $rootScope.$broadcast(Event.Message.Display, 'โหลดข้อมูลล้มเหลวกรุณาลองอีกครั้ง');
            });
        })
    }

    $scope.payment = function () {
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
                $scope.payment();
            }, 1000);
        }
    };

    $scope.search = function () {
        $scope.status.loading = true;
        load().then(function () {
            $scope.status.loading = false;
        });
    };

    $scope.edit = function (pm) {
        $scope.navigateTo('#/edit-payment?id=' + pm.id);
    };

    $scope.delete = function (pm) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            PaymentService.delete(pm.id).then(function () {
                load().then(function () {
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

    $scope.payment();
}]);
