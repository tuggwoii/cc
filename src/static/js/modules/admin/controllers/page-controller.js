'use strict';
module.controller('PageController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'Helper', 'PagesService', 'Event',
function ($scope, $rootScope, $timeout, $q, $location, Helper, PagesService, Event) {
    var editor;
    $scope.params = $location.search();

    $scope.status = {
        loading: false
    };

    function loadResources() {
        $q.all([
            PagesService.get().then(function (res) {
                if (app.debug) {
                    console.log('GET PAGES', res);
                }
                $scope.pages = res.data;
            }).catch(function () {
                alert('CAN NOT LOAD PAGES');
            })
        ]).then(function () {
            initRTE();
            initModel();
            $scope.displayView();
        });
    }

    function initModel() {
        $scope.model = {
            isStatic: true
        };
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
    }

    function isValid() {
        return $scope.user && $scope.user.id && $scope.user.role.id == 1;
    }

    $scope.pageDetail = function () {
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
                $scope.pageDetail();
            }, 1000);
        }
    };

    $scope.validate = function () {
        var isValid = true;
        angular.forEach($scope.pages, function (p) {
            if ($scope.model.name && $scope.model.name.toLowerCase() == p.name.toLowerCase()) {
                isValid = false;
                $scope.status.name_exist = true;
            }
            if ($scope.model.url) {
                $scope.model.url = Helper.replaceUrl($scope.model.url);
                if ($scope.model.url[0] != '/') {
                    $scope.model.url = '/' + $scope.model.url;
                }
                if($scope.model.url.toLowerCase() == p.url.toLowerCase()){   
                    isValid = false;
                    $scope.status.url_exist = true;
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
            PagesService.create($scope.model).then(function () {
                $scope.navigateTo('#/edit-page?id=' + $scope.model.name);
            }).catch(function () {
                $scope.status.error = true;
                $rootScope.$broadcast(Event.Load.Dismiss);
                alert('SAVE PAGE ERROR');
            });
        }
        else {
            $scope.status.invalid = true;
        }

    };

    $scope.pageDetail();
}]);
