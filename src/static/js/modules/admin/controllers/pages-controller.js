'use strict';
module.controller('PagesController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'PagesService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, PagesService, Event) {

    $scope.params = $location.search();

    $scope.status = {
        loading: false
    };

    function loadResources() {
        $q.all([
            loadPages()
        ]).then(function () {
            $scope.displayView();
        });
    }


    function isValid() {
        return $scope.user
            && $scope.user.id
            && $scope.user.role.id == 1;
    }

    function loadPages() {
        return $q(function (resolve, reject) {
            PagesService.get().then(function (res) {
                if (app.debug) {
                    console.log('GET PAGES', res);
                }
                $scope.model = res.data;
                resolve();
            }).catch(function () {
                reject();
                $rootScope.$broadcast(Event.Message.Display, 'โหลดข้อมูลล้มเหลวกรุณาลองอีกครั้ง');
            });
        })
    }

    $scope.pages = function () {
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
                $scope.pages();
            }, 1000);
        }
    };

    $scope.edit = function (page) {
        console.log(page)
        if (page.isStatic) {
            $scope.navigateTo('#/edit-page?id=' + page.name);
        }
    };

    $scope.delete = function (page) {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            PagesService.delete(page.name).then(function () {
                loadPages().then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                });
            }).catch(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'ลบหน้านี้ไม่ได้กรุณาลองใหม่');
                }, 500);
            });
        });
    };

    $scope.pages();
}]);
