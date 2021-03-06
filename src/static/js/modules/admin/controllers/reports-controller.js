﻿'use strict';
module.controller('AdminReportController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'ReportService', 'Event', 'RepairService',
    function ($scope, $rootScope, $timeout, $q, $location, Helper, ReportService, Event, RepairService) {

    var lightbox = lity();

    $scope.params = $location.search();

    $scope.status = {
        loading: false
    };

    $scope.query = {
        p: 1,
        months: '',
        year: ''
    };

    $scope.months = Helper.getMonthListAsKeyPair();

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
            ReportService.get($scope.query).then(function (res) {
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

    function reports() {
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
                reports();
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
        $scope.navigateTo('#!/edit-car?id=' + car.id);
    };

    $scope.delete = function (m) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            ReportService.delete(m).then(function () {
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

    $scope.deleteImage = function (m) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            ReportService.deleteImage(m.id).then(function () {
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

    $scope.recoverImage = function (m) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            ReportService.recoverImage(m.id).then(function () {
                loadModels().then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            }).catch(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'กู้ภาพไม่ได้กรุณาลองใหม่อีกครั้ง');
                }, 500);
            });
        }, 'ยืนยันที่จะกู้คืนภาพหรือไม่');
    };

    $scope.getDeleteImge = function (url) {
        if (url) {
            var paths = url.split('/');
            var file_name_with_ext = paths[paths.length - 1];
            var file_exts = file_name_with_ext.split('.');
            var file_name = file_exts[0];
            var file_ext = file_exts[1];
            var file_url_del = '/files/' + file_name + '_del' + '.' + file_ext;
            url = file_url_del;
        }
        return url;
    };

    $scope.removeImage = function (image) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            RepairService.deleteImage(image).then(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $scope.search();
            }).catch(function () {
                $rootScope.$broadcast(Event.Message.Display, 'ลบรูปไม่ได้กรุณาลองใหม่');
            });
        });
    };

    $scope.showImage = function (url) {
        lightbox(url);
    };

    reports();
}]);
