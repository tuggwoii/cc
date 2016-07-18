'use strict';
module.controller('NotificationController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'NotificationService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, NotificationService, Event, Helper) {

        $scope.status = {};
        $scope.dates = Helper.dateArray();
        $scope.months = Helper.monthArray();
        $scope.process = [];
        $scope.params = $location.search();
        $scope.isNotificationPage = $location.$$path.indexOf('/notification') > -1 && $location.$$path.indexOf('/notifications') == -1;
        $scope.isNotificationDetail = $scope.params.id && $scope.isNotificationPage;

        function getById () {
            NotificationService.getById($scope.params.id).then(function (data) {
                $scope.model = data;
                setInitModel($scope.model);
            }).catch(function () {

            });
        }

        function setInitModel(model) {
            model.car = model.for_car + '';
            model.type = model.type + '';
            model.work = model.work + '';
            if (model.date) {
                var date = new Date(model.date);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                var date = date.getDate();
                if (date < 10) {
                    date = '0' + date;
                }
                model.date_str = year + '/' + month + '/' + date;
            }
            datePicker();
            $rootScope.$broadcast(Event.Car.SetActive, model.car);
        }

        function setSubmitModelDate () {
            if ($('input[name=prefix__date__suffix]').val()) {
                $scope.model.date = new Date($('input[name=prefix__date__suffix]').val());
                $scope.empty_date = false;
            }
            else {
                if ($scope.model.type == 1) {
                    $scope.empty_date = true;
                }
                else {
                    $scope.empty_date = false;
                }
            }
        }

        function datePicker() {
            $timeout(function () {
                $('.datepicker').pickadate({
                    monthsShort: Helper.monthsShort,
                    monthsFull: Helper.monthsFull,
                    format: 'dd mmmm, yyyy',
                    formatSubmit: 'yyyy/mm/dd',
                    hiddenPrefix: 'prefix__',
                    hiddenSuffix: '__suffix'
                });
            }, 500);
        }

        $scope.init = function () {
            $scope.model = {};
            if ($scope.params.id && $scope.isNotificationDetail) {
                getById();
            }
        };

        $scope.setForm = function (form) {
            $scope.form = form;
        };

        $scope.carChange = function () {
            $rootScope.$broadcast(Event.Car.SetActive, $scope.model.car);
        }

        $scope.setModelCar = function (event, carId) {
            $scope.model.car = carId +'';
        };

        $scope.typeChange = function () {
            datePicker();
        }

        $scope.add = function (form) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            setSubmitModelDate();
            if (form.$valid) {
                if (!$scope.empty_date) {
                    $rootScope.$broadcast(Event.Load.Display,'SAVE_NOTIFICATION');
                    $scope.status = {};
                    NotificationService.create($scope.model).then(function (res) {
                        $rootScope.$broadcast(Event.Load.Dismiss);
                        $scope.navigateTo('#/notification?id=' + res.data.id);
                        $scope.status.success = true;
                        $timeout(function () {
                            $scope.status = {};
                        }, 5000);
                    }).catch(function (res) {
                        if (res.error.message == 'CAR EXPIRE') {
                            $scope.status.car_expire = true;
                        }
                        else {
                            $scope.status.error = true;
                        }
                        $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_NOTIFICATION');
                    });
                }
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.update = function (form) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            setSubmitModelDate();
            if (form.$valid) {
                $rootScope.$broadcast(Event.Load.Display, 'SAVE_NOTIFICATION');
                $scope.status = {};
                NotificationService.update($scope.model).then(function (res) {
                    $scope.model = res;
                    setInitModel($scope.model);
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_NOTIFICATION');
                    $scope.status.success = true;
                    $timeout(function () {
                        $scope.status = {};
                    }, 5000);
                }).catch(function (res) {
                    if (res.error.message == 'CAR EXPIRE') {
                        $scope.status.car_expire = true;
                    }
                    else {
                        $scope.status.error = true;
                    }
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_NOTIFICATION');
                });
            }
            else {
                $scope.status.invalid = true;
            }
        };

        $scope.remove = function () {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display, 'SAVE_NOTIFICATION');
                NotificationService.delete($scope.params.id).then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_NOTIFICATION');
                    $scope.navigateTo('#/notifications');
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss, 'SAVE_NOTIFICATION');
                    alert('ERROR');
                });
            });
        };

        $scope.$on(Event.Page.Ready, function () {
            $scope.init();
        });

        $scope.init();
        $scope.$on(Event.Car.PickCar, $scope.setModelCar);
    }]);
