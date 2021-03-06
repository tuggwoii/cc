﻿'use strict';
module.controller('AdminFilesController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'FileService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, FileService, Event) {

    $scope.params = $location.search();
    var lightbox = lity();

    $scope.status = {
        loading: false
    };

    $scope.query = {
        p: 1,
        months: '',
        year: '',
        type: 1,
        sort: '0'
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
            FileService.get($scope.query).then(function (res) {
                if (app.debug) {
                    console.log('GET REPORTS', res);
                }
                $scope.model = res.data;
                initModel($scope.model);
                $scope.pagings(res.meta);
                initScroll();
                resolve();
            }).catch(function () {
                reject();
                $rootScope.$broadcast(Event.Message.Display, 'โหลดข้อมูลล้มเหลวกรุณาลองอีกครั้ง');
            });
        })
    }

    function initModel(model) {
        for (var i = 0; i < model.length; i++) {
            model[i].upload_date = Helper.shortDate(new Date(model[i].createdAt))
        }
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
                files();
            }, 1000);
        }
    };

    function genYear() {
        var years = [];
        var now = new Date();
        var final_year = now.getFullYear() + 543;
        for (var current_year = 2558; current_year <= final_year; current_year++) {
            years.push(current_year + '');
        }
        return years;
    }

    $scope.years = genYear();

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

    $scope.showImage = function (img) {
        lightbox(img.url);
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

    $scope.categoryClick = function (type) {
        $scope.query.type = type;
        $scope.search();
    };

    files();
}]);
