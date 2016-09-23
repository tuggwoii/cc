'use strict';
module.controller('EditPageController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'PagesService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, PagesService, Event) {
    var editor;
    $scope.params = $location.search();

    $scope.status = {
        loading: false
    };

    function loadPages() {
        return $q(function (resolve, reject) {
            PagesService.get().then(function (res) {
                if (app.debug) {
                    console.log('GET PAGES', res);
                }
                $scope.pages = angular.copy(res.data);
                resolve();
            }).catch(function () {
                reject();
                $rootScope.$broadcast(Event.Message.Display, 'โหลดข้อมูลล้มเหลวกรุณาลองอีกครั้ง');
            });
        })
    }

    function loadResources() {
        $q.all([
           loadPages()
        ]).then(function () {
            initModel();
            $scope.displayView();
        });
    }

    function initModel() {
        angular.forEach($scope.pages, function (p) {
            if (p.name == $scope.params.id) {
                $scope.model = angular.copy(p);
                p.isCurrent = true;
            }
        });
        if ($scope.model) {
            $.get($scope.model.view).success(function (res) {
                $scope.model.content = res;
                initRTE();
            });
        }
        else {
            window.location.hash = '/pages';
        }
    }

    function initRTE() {
        editor = tinymce.init({
            selector: '.rte',
            themes: "modern",
            height: 400,
            menubar: false,
            statusbar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media contextmenu paste code'
            ],
            toolbar: 'undo redo | styleselect | bold italic | bullist numlist | link image',
            content_css: '/css/rte.css'
        });
        $timeout(function () {
            tinyMCE.activeEditor.setContent($scope.model.content, { format: 'raw' });
        }, 500);
    }

    function isValid() {
        return $scope.user
            && $scope.user.id
            && $scope.user.role.id == 1
            && $scope.params.id;
    }

    $scope.pageDetail = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                loadResources();
            }
            else {
                window.location.hash = '/pages';
            }
        }
        else {
            $timeout(function () {
                $scope.pageDetail();
            }, 1000);
        }
    };

    $scope.validate = function () {
        var isValid = true;
        angular.forEach($scope.pages, function (p) {
            if ($scope.model.name && $scope.model.name.toLowerCase() == p.name.toLowerCase()) {
                if (!p.isCurrent) {
                    isValid = false;
                    $scope.status.name_exist = true;
                }
            }
            if ($scope.model.url) {
                $scope.model.url = Helper.replaceUrl($scope.model.url);
                if ($scope.model.url[0] != '/') {
                    $scope.model.url = '/' + $scope.model.url;
                }
                if ($scope.model.url.toLowerCase() == p.url.toLowerCase()) {
                    if (!p.isCurrent) {
                        isValid = false;
                        $scope.status.url_exist = true;
                    }
                }
            }
        });
        $scope.model.content = tinyMCE.activeEditor.getContent({ format: 'raw' });
        return isValid;
    };

    $scope.save = function (form) {
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        $scope.status = {};
        if ($scope.validate() && form.$valid) {
            $rootScope.$broadcast(Event.Load.Display);
            PagesService.update($scope.model).then(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $scope.status.success = true;
                $timeout(function () {
                    $scope.status.success = false;
                }, 5000);
            }).catch(function () {
                $scope.status.error = true;
                $rootScope.$broadcast(Event.Load.Dismiss);
                $rootScope.$broadcast(Event.Message.Display, 'Save หน้านี้ไม่ได้กรุณาลองใหม่');
            });
        }
        else {
            $scope.status.invalid = true;
        }

    };

    $scope.delete = function () {
        $rootScope.$broadcast(Event.Confirm.Display, function () {
            $rootScope.$broadcast(Event.Load.Display);
            PagesService.delete($scope.model.name).then(function () {
                $scope.navigateTo('#/pages');
            }).catch(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $timeout(function () {
                    $rootScope.$broadcast(Event.Message.Display, 'ลบหน้านี้ไม่ได้กรุณาลองใหม่');
                }, 500);
            });
        });
    };

    $scope.pageDetail();
}]);
