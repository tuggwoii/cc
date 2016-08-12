﻿'use strict';
module.controller('SharesController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'ShareService', 'WorkgroupService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, ShareService, WorkgroupService, Event, Helper) {

        $scope.query = {
            limits: 20
        };

        $scope.sharesPage = function () {
            $scope.currentPage = 1;
            $q.all([
                 $scope.getAll(),
                 WorkgroupService.get().then(function (data) {
                     $scope.workgroup = angular.copy(data);
                 })
            ]).then(function () {
                $scope.displayView();
            });
        };

        $scope.getAll = function (notify) {
            if (notify) {
                $rootScope.$broadcast(Event.Load.Display);
            }
            
            ShareService.get($scope.currentPage, $scope.query).then(function (res) {
                $scope.shares = res.data;
                $scope.meta(res.meta);
                if (notify) {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                }
            }).catch(function () {
                window.location.reload();
            });
        };

        $scope.meta = function (meta) {
            if (meta.limits * $scope.currentPage < meta.count) {
                $scope.hasMore = true;
            }
            else {
                $scope.hasMore = false;
            }
        };

        $scope.loadMore = function () {
            $scope.currentPage++;
            $rootScope.$broadcast(Event.Load.Display);
            ShareService.get($scope.currentPage, 20).then(function (res) {
                $scope.shares = $scope.shares.concat(res.data);
                $scope.meta(res.meta);
                $rootScope.$broadcast(Event.Load.Dismiss);
            }).catch(function () {
                alert('ERROR');
                console.log('ERROR');
                $rootScope.$broadcast(Event.Load.Display);
            });
        }

        $scope.selectWorkgroup = function (work) {
            if (work) {
                if (!work.active) {
                    angular.forEach($scope.workgroup, function (w) {
                        w.active = false;
                    });
                    work.active = true;
                    $scope.query.work = work.id;
                    $scope.getAll(true);
                }
            }
            else {
                angular.forEach($scope.workgroup, function (w) {
                    w.active = false;
                });
                if ($scope.query.work) {
                    delete $scope.query['work'];
                    $scope.getAll(true);
                }
            }
        };

        $scope.sharesPage();
    }]);
