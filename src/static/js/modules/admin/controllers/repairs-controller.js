'use strict';
module.controller('RepairsController', ['$scope', '$rootScope', '$timeout', '$q', 'ShareService', 'Helper', 'Event',
function ($scope, $rootScope, $timeout, $q, ShareService, Helper, Event) {

    $scope.query = {
        p: 1,
        q: '',
        e: '',
        r: '',
        sort_order: 'DESC',
        sort_column: 'date',
        limits: 100
    };

    $scope.status = {
        loading: false
    };

    function loadUsers(isPaging) {
        ShareService.get($scope.query.p, $scope.query).then(function (res) {
            if (app.debug) {
                console.log('GET REPAIRS', res);
            }
            $scope.repairs = res.data;
            initModel($scope.repairs);
            $scope.pagings(res.meta);
            initScroll();
            if (isPaging) {
                $rootScope.$broadcast(Event.Load.Dismiss);
            }
        }).catch(function () {
            alert('CAN NOT LOAD REPAIRS');
            if (isPaging) {
                $rootScope.$broadcast(Event.Load.Dismiss);
            }
        })
    }

    function loadResources() {
        $q.all([
            loadUsers()
        ]).then(function () {
            $scope.displayView();
        });
    }

    function isValid() {
        return $scope.user && $scope.user.id && $scope.user.role.id == 1;
    }

    function initModel(users) {
        angular.forEach(users, function (u) {
            u.date_str = Helper.shortDate(u.date);
            u.car.exp_date_str = Helper.shortDate(u.car.exp_date);
        });
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
        }, 200);
    }

    $scope.search = function () {
        $scope.status.loading = true;
        $scope.query.p = 1;
        ShareService.get($scope.query.p, $scope.query).then(function (res) {
            if (app.debug) {
                console.log('GET REPAIRS', res);
            }
            $scope.repairs = res.data;
            initModel($scope.repairs);
            $scope.pagings(res.meta);
            initScroll();
            $timeout(function () {
                $scope.status.loading = false;
            }, 500);
        }).catch(function () {
            alert('CAN NOT LOAD REPAIRS');
            $timeout(function () {
                $scope.status.loading = false;
            }, 500);
        })
    };

    $scope.usersPage = function () {
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
                $scope.usersPage();
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
            loadUsers(true);
        }
    };

    $scope.usersPage();
}]);
