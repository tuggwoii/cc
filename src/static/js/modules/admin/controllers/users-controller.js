'use strict';
module.controller('UsersController', ['$scope', '$rootScope', '$timeout', '$q', 'AccountService', 'Helper', 'Event',
function ($scope, $rootScope, $timeout, $q, AccountService, Helper, Event) {

    $scope.query = {
        p: 1,
        q: '',
        e: '',
        r: '',
        o: 'ASC',
        s: 'name'
    };

    $scope.status = {
        loading: false
    };

    function loadUsers(isPaging) {
        AccountService.getAll($scope.query).then(function (res) {
            if (app.debug) {
                console.log('GET USERS', res);
            }
            $scope.users = res.data;
            initModel($scope.users);
            $scope.pagings(res.meta);
            initScroll();
            if (isPaging) {
                $rootScope.$broadcast(Event.Load.Dismiss);
            }
        }).catch(function () {
            alert('CAN NOT LOAD USERS');
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
            u.register_date = Helper.readableDate(u.createdAt);
        });
    }

    function initScroll() {
        $timeout(function () {
            var myScroll = new IScroll('#iscroll', {
                scrollX: true, scrollY: false,
                mouseWheel: true,
                scrollbars: true
            });
        }, 200);
    }

    $scope.search = function () {
        $scope.status.loading = true;
        $scope.query.p = 1;
        AccountService.getAll($scope.query).then(function (res) {
            if (app.debug) {
                console.log('GET USERS', res);
            }
            $scope.users = res.data;
            $scope.pagings(res.meta);
            initScroll();
            $timeout(function () {
                $scope.status.loading = false;
            }, 500);
        }).catch(function () {
            alert('CAN NOT LOAD USERS');
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
