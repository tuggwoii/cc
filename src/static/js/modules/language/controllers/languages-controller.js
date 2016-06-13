'use strict';
module.controller('LanguagesController', ['$scope', '$timeout', 'LanguageService', 'NotificationService',
function ($scope, $timeout, LanguageService, NotificationService) {

    $scope.model = {};
    $scope.form = {};

    $scope.onLoad = function () {
        $scope.loadModel();
    };

    $scope.loadModel = function () {
        NotificationService.loading();
        LanguageService.getAll().success(function (res) {
            $scope.model = res.data;
		}).error(function () {
		    NotificationService.openDialog({
		        message: $scope.strings['cant_load_languages']
		    });
		}).finally(function () {
            NotificationService.stopLoading();
		});
    };

    $scope.openForm = function () {
        $scope.form = {};
        $scope.form.model = {};
        $scope.form.displayForm = true;
        $scope.form.animate = 'slideInRight';
    };

    $scope.onCreate = function (form) {
        if (form.$valid) {
            $scope.form.error = false;
            NotificationService.loading();
            LanguageService.create($scope.form.model).success(function () {
                NotificationService.openNotify({
                    title: $scope.strings['success'],
                    message: $scope.strings['add_language_success'],
                    type: 'success'
                });
                $scope.closeForm();
                $scope.loadModel();

            }).error(function () {
                NotificationService.openDialog({
                    message: $scope.strings['cant_add_language']
                });
            }).finally(function () {
                NotificationService.stopLoading();
            });
        }
        else {
            $scope.form.error = 'error';
        }
    };

    $scope.onDelete = function (id) {
        NotificationService.confirm(function () {
            NotificationService.loading();
            LanguageService.delete(id).success(function () {
                NotificationService.openNotify({
                    title: $scope.strings['success'],
                    message: $scope.strings['delete_language_success'],
                    type: 'success'
                });
                $scope.loadModel();
            }).error(function () {
                NotificationService.openDialog({
                    message: $scope.strings['cant_delete_language']
                });
            }).finally(function () {
                NotificationService.stopLoading();
            });
        });
    }

    $scope.keyPress = function (event, form) {
        if (event.keyCode === 13) {
            $scope.onCreate(form);
        }
    }

    $scope.closeForm = function () {
        $scope.form.animate = 'slideOutRight';
        $timeout(function () {
            $scope.form.displayForm = false;
        }, 500);
    };

    $scope.onLoad();

}]);
