'use strict';
module.controller('HotelController', ['$scope', '$timeout', '$location', 'HotelService', 'NotificationService',
    function ($scope, $timeout, $location, HotelService, NotificationService) {

    $scope.state = {};
    $scope.user = {};
    $scope.params = $location.search();

    $scope.onLoad = function () {
        $scope.loadModel();
    };

    $scope.loadModel = function () {
        NotificationService.loading();
        HotelService.get($scope.params.id).success(function (res) {
            $scope.model = res.data;
        }).error(function () {
            NotificationService.openDialog({
                message: $scope.strings['cant_load_hotel']
            });
        }).finally(function () {
            NotificationService.stopLoading();
        });
    };

    $scope.onDelete = function () {
        NotificationService.confirm(function () {
            NotificationService.loading();
            HotelService.delete($scope.model.id).success(function () {
                NotificationService.openNotify({
                    title: $scope.strings['success'],
                    message: $scope.strings['delete_hotel_success'],
                    type: 'success'
                });
                window.location.href = '/dashboard#/hotels';
            }).error(function () {
                NotificationService.openDialog({
                    message: $scope.strings['cant_delete_hotel']
                });
            }).finally(function () {
                NotificationService.stopLoading();
            });
        });
    };

    $scope.onLoad();

}]);
