'use strict';
module.controller('RepairController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'RepairService', 'CarService', 'WorkgroupService', 'WorkService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, RepairService, CarService, WorkgroupService, WorkService, Event, Helper) {
        $scope.ratings = ['ไม่ระบุ', 'แย่มาก', 'แย่', 'พอได้', 'ดี', 'ดีมาก']
        $scope.params = $location.search();
        $scope.from_car = $scope.params.car ? true : false;
        if ($scope.from_car) {
            $scope.carId = $scope.params.car;
        }
        var lightbox = lity();

        function getById() {
            $q.all([
                RepairService.getById($scope.params.id).then(function (data) {
                    $scope.model = data;
                    initModel($scope.model);

                }).catch(function () {
                    alert('ERROR LOAD REPAIR');
                }),
                CarService.get().then(function (res) {
                    $scope.cars = angular.copy(res.data);
                }),
                WorkgroupService.get().then(function (data) {
                    $scope.workgroup = angular.copy(data);
                })
            ]).then(function () {
                $scope.displayView();
                angular.forEach($scope.cars, function (_car) {
                    if (_car.id == $scope.model.for_car) {
                        _car.active = true;
                    }
                });
            });
        }

        function initModel(model) {
            if (model.date) {
                var date = new Date(model.date);
                model.date_str = Helper.readableDate(date);
            }
            $scope.calPrice();
            watch();
        }

        function isValid() {
            return $scope.params.id && $scope.user && $scope.user.id;
        }

        var watchScore;
        var watchShare;
        function watch() {
            if (watchShare) {
                watchShare();
            }
            if (watchScore) {
                watchScore();
            }
            watchScore = $scope.$watch('model.score', function (newValue, oldValue) {
                $scope.save();
                
            });
            watchShare = $scope.$watch('model.share', function (newValue, oldValue) {
                $scope.save();
            });
        }

        $scope.notificationPage = function () {
            if ($scope.user_ready) {
                if (isValid()) {
                    getById();
                }
                else {
                    window.location.hash = '#/';
                }
            }
            else {
                $timeout(function () {
                    $scope.notificationPage();
                }, 200);
            }
        };

        $scope.reload = function () {
            RepairService.getById($scope.params.id).then(function (data) {
                $scope.model = data;
                initModel($scope.model);
            }).catch(function () {
                alert('ERROR LOAD REPAIR');
            })
        }

        $scope.save = function () {
            $rootScope.$broadcast(Event.Load.Display);
            RepairService.update($scope.model).then(function (res) {
                $rootScope.$broadcast(Event.Load.Dismiss);
            }).catch(function (res) {
                $rootScope.$broadcast(Event.Load.Dismiss);
                alert('Save Error');
            });
        }

        $scope.openShop = function () {
            $rootScope.$broadcast(Event.Shop.DisplayPopup, function (shop) {
                $scope.model.shop = shop;
                $scope.save();
            });
        };

        $scope.openWork = function () {
            $rootScope.$broadcast(Event.Work.DisplayPopup,
                { repair: $scope.model.id, work: $scope.model.work + '' },
                $scope.workgroup,
                function () {
                    $scope.reload();
                });
        };

        $scope.editWork = function (work) {
            $rootScope.$broadcast(Event.Work.DisplayPopup,
                work,
                $scope.workgroup,
                function () {
                    $scope.reload();
                });
        };

        $scope.deleteWork = function (work) {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display);
                WorkService.delete(work.id).then(function (res) {
                    $scope.reload();
                }).catch(function () {
                    alert('DELETE WORK ERROR');
                });
            });
        };

        $scope.openNotification = function () {
            $rootScope.$broadcast(Event.Notification.DisplayPopup,
                { car: $scope.model.car.id, repair: $scope.model.id, work: $scope.model.work + '', enable: true },
                $scope.strings,
                $scope.workgroup,
                function () {
                    $scope.reload();
                });
        };

        $scope.calPrice = function () {
            var price = 0.0;
            angular.forEach($scope.model.repair_works, function (i) {
                price += i.price;
            });
            if ($scope.model.price != price) {
                $scope.model.price = price;
                $scope.save();
            }
        };

        $scope.pickCar = function (car) {
            $scope.navigateTo('#/car?id=' + car.id);
        };

        $scope.rated = function (score) {
            $scope.model.score = score;
        };

        $scope.saveImage = function (event, file) {
            var fileData = {
                repair_id: $scope.model.id,
                image_id: file.id
            };
            RepairService.uploadImage(fileData).then(function () {
                $scope.reload()
            }).catch(function () {
                alert('Upload Error');
            });
        };

        $scope.removeImage = function (image) {
            $rootScope.$broadcast(Event.Confirm.Display, function () {
                $rootScope.$broadcast(Event.Load.Display);
                RepairService.deleteImage(image).then(function () {
                    $scope.reload()
                }).catch(function () {
                    alert('Upload Error');
                });
            });
        };

        $scope.imageCaption = function (image, index) {
            $rootScope.$broadcast(Event.Repair.DisplayCaptionPopup, image, function (model) {
                console.log(model);
                $scope.model.repair_images[index] = model;
            });
        };

        $scope.lightbox = function (url) {
            lightbox(url);
        };

        $scope.$on(Event.File.Success, $scope.saveImage);
        $scope.notificationPage();
    }]);
