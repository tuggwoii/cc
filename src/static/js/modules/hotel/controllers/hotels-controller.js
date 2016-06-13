'use strict';
module.controller('HotelsController', ['$scope', '$timeout', 'HotelService', 'NotificationService',
function ($scope, $timeout, HotelService, NotificationService) {

    $scope.model = {};
    $scope.form = {};

    $scope.onLoad = function () {
        $scope.loadModel();
    };

    $scope.loadModel = function () {
        NotificationService.loading();
        HotelService.getAll().success(function (res) {
            $scope.model = res.data;
		}).error(function () {
		    NotificationService.openDialog({
		        message: $scope.strings['cant_load_hotel']
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
            HotelService.create($scope.form.model).success(function (res) {
                NotificationService.openNotify({
                    title: $scope.strings['success'],
                    message: $scope.strings['add_hotel_success'],
                    type: 'success'
                });
                $scope.closeForm();
                window.location.href = '/dashboard#/hotel?id=' + res.data.id;
            }).error(function () {
                NotificationService.openDialog({
                    message: $scope.strings['cant_add_hotel']
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
            HotelService.delete(id).success(function () {
                NotificationService.openNotify({
                    title: $scope.strings['success'],
                    message: $scope.strings['delete_hotel_success'],
                    type: 'success'
                });
                $scope.loadModel();
            }).error(function () {
                NotificationService.openDialog({
                    message: $scope.strings['cant_delete_hotel']
                });
            }).finally(function () {
                NotificationService.stopLoading();
            });
        });
    };

    $scope.edit = function (id) {
        window.location.href = '/dashboard#/hotel?id=' + id;
    };

    $scope.keyPress = function (event, form) {
        if (event.keyCode === 13) {
            $scope.onCreate(form);
        }
    };

    $scope.closeForm = function () {
        $scope.form.animate = 'slideOutRight';
        $timeout(function () {
            $scope.form.displayForm = false;
        }, 500);
    };

    $scope.onLoad();

}]);
