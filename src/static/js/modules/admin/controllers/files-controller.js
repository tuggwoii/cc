'use strict';
module.controller('AdminFilesController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'FileService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, FileService, Event) {

    $scope.params = $location.search();

    $scope.status = {
        loading: false
    };

    $scope.query = {
        p: 1
    };

    function loadResources() {
        $q.all([
            loadModels()
        ]).then(function () {
            $scope.displayView();
        });
    }


    function isValid() {
        return $scope.user
            && $scope.user.id
            && $scope.user.role.id == 1;
    }

    function loadModels() {
        return $q(function (resolve, reject) {
            FileService.get($scope.query).then(function (res) {
                if (app.debug) {
                    console.log('GET REPORTS', res);
                }
                $scope.model = res.data;
                $scope.pagings(res.meta);
                initScroll();
                resolve();
            }).catch(function () {
                reject();
                $rootScope.$broadcast(Event.Message.Display, 'โหลดข้อมูลล้มเหลวกรุณาลองอีกครั้ง');
            });
        })
    }

    function initScroll() {
        $timeout(function () {
            var myScroll = new IScroll('#iscroll', {
                scrollX: true,
                scrollY: false,
                mouseWheel: false,
                scrollbars: true,
                click: true
            });
        }, 300);
    }

    function files() {
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

    $scope.pagings = function (meta) {
        $scope.pages = [];
        $scope.total = meta.count;
        $scope.limits = meta.limits;
        if (meta.count && meta.limits) {
            var page_count = Math.ceil(meta.count / meta.limits);
            for (var i = 1; i <= page_count; i++) {
                $scope.pages.push(i);
            }
        }
    };

    $scope.gotoPage = function (page) {
        if (page != $scope.query.p) {
            $scope.query.p = page;
            $rootScope.$broadcast(Event.Load.Display);
            loadModels().then(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
            });
        }
    };

    $scope.search = function () {
        $scope.query.p = 1;
        $scope.status.loading = true;
        loadModels().then(function () {
            $scope.status.loading = false;
        });
    };

    $scope.edit = function (car) {
        $scope.navigateTo('#/edit-car?id=' + car.id);
    };

    $scope.delete = function (m) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            FileService.delete(m.id).then(function () {
                loadModels().then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            }).catch(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'ลบไม่ได้กรุณาลองใหม่หรือตรวจสอบให้แน่ใจว่าลบข้อมูลที่เกี่ยวข้องออกทั้งหมดแล้ว');
                }, 500);
            });
        });
    };

    files();
}]);
