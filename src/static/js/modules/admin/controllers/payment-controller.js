'use strict';
module.controller('AdminPaymentController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'PaymentService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, PaymentService, Event) {

    $scope.params = $location.search();
    var date = new Date();

    $scope.status = {
        loading: false
    };
    $scope.query = {
        year: (date.getFullYear() + 543) + ""
    };

    $scope.paymentStatus = [
        { key: 'ยังไม่ดำเนินการ', value: '0' },
        { key: 'ดำเนินการแล้ว', value: '1' },
        { key: 'ไม่พบการโอนเงิน', value: '2' }
    ];

    function genYear() {
        var years = [];
        var now = new Date();
        var final_year = now.getFullYear() + 543;
        for (var current_year = 2558; current_year <= final_year; current_year++) {
            years.push(current_year + '');
        }
        return years;
    }

    function loadResources() {
        $q.all([
            load()
        ]).then(function () {
            $scope.years = genYear();
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
                calculateTotal();
                initScroll();
                resolve();
            }).catch(function () {
                reject();
                $rootScope.$broadcast(Event.Message.Display, 'โหลดข้อมูลล้มเหลวกรุณาลองอีกครั้ง');
            });
        });
    }

    function initScroll() {
        $timeout(function () {
            var myScroll = new IScroll('#iscroll', {
                scrollX: true, scrollY: false,
                mouseWheel: false,
                scrollbars: true
            });
        }, 200);
    }

    function calculateTotal() {
        $scope.total = 0;
        angular.forEach($scope.model, function (m) {
            if ($scope.query.status) {
                $scope.total += m.price;
            }
            else {
                if (m.status == 1) {
                    $scope.total += m.price;
                }
            }
        });
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

    function validateYearMonthFilter() {
        var test = parseInt($scope.query.year);
        if (isNaN(test)) {
            $scope.query.year = date.getFullYear() + 543
        }
        else if (parseInt($scope.query.year) < 0) {
            $scope.query.year = date.getFullYear() + 543
        }
        else if ($scope.query.month && !$scope.query.year) {
            $scope.query.month = '';
            $scope.query.year = date.getFullYear() + 543;
        }
    }

    $scope.search = function () {
        $scope.status.loading = true;
        validateYearMonthFilter();
        load().then(function () {
            $scope.status.loading = false;
        });
    };

    $scope.edit = function (pm) {
        $scope.navigateTo('#!/edit-payment?id=' + pm.id);
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
                    $rootScope.$broadcast(Event.Message.Display, 'ลบไม่ได้กรุณาลองใหม่หรือติดต่อผู้ดูแล');
                }, 500);
            });
        });
    };

    $scope.payment();
}]);
