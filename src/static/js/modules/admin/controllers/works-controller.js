'use strict';
module.controller('WorksController', ['$scope', '$rootScope', '$timeout', '$q', 'WorkgroupService', 'Event',
function ($scope, $rootScope, $timeout, $q, WorkgroupService, Event) {

    $scope.query = {
        p: 1,
        q: '',
        e: '',
        r: ''
    };

    $scope.status = {
        loading: false
    };

    function loadResources () {
        $q.all([
           loadWorks()
        ]).then(function () {
            $scope.displayView();
        });
    }

    function loadWorks () {
        return $q(function (r, j) {
            WorkgroupService.get($scope.query).then(function (res) {
                if (app.debug) {
                    console.log('GET WORKS', res);
                }
                $scope.works = res.data;
                r();
            }).catch(function () {
                alert('CAN NOT LOAD WORKS');
                j();
            });
        })
    }


    function isValid() {
        return $scope.user && $scope.user.id && $scope.user.role.id == 1;
    }

    $scope.worksPage = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                loadResources();
            }
            else {
                window.location.hash = '/admin#/';
            }
        }
        else {
            $timeout(function () {
                $scope.worksPage();
            }, 1000);
        }
    };

    $scope.add = function () {
        $rootScope.$broadcast(Event.Workgroup.DisplayWorkgroupPopup, {}, function () {
            $rootScope.$broadcast(Event.Load.Display);
            loadWorks().then(function () {
                //$rootScope.$broadcast(Event.Load.Dismiss);
            });
        });
    };

    $scope.edit = function (wg) {
        $rootScope.$broadcast(Event.Workgroup.DisplayWorkgroupPopup, wg, function () {
            $rootScope.$broadcast(Event.Load.Display);
            loadWorks().then(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
            });
        });
    };
    $scope.delete = function (wg) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            WorkgroupService.delete(wg).then(function () {
                loadWorks().then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            }).catch(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'ลบกลุ่มงานไม่ได้โปรดตรวจสอบให้แน่ใจว่าได้ลบงานซ่อมที่เกี่ยวข้องออกทั้งหมดแล้ว');
                }, 500);
            });
        });
    };

    $scope.worksPage();
}]);
