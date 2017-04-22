'use strict';
module.controller('AppController', ['$scope', '$rootScope', '$timeout', '$cookies', '$q', 'AccountService', 'StringService', 'Event', 'FileService', 'WorkgroupService', 'CarService', 'Helper',
    function ($scope, $rootScope, $timeout, $cookies, $q, AccountService, StringService, Event, FileService, WorkgroupService, CarService, Helper) {

        $scope.strings_ready = false;
        $scope.user_ready = false;
        $scope.upload_car_id = '';

        function clearWorksState() {
            angular.forEach($scope.workgroup, function (w) {
                w.active = false;
            });
        }

        function initUserModel(model) {
            if (model.contacts && model.contacts.length) {
                angular.forEach(model.contacts, function (c) {
                    c.pay_date = Helper.readableDate(c.createdAt);
                });
            }
            return model;
        }

        $scope.displayView = function () {
            $timeout(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $("html, body").animate({
                    scrollTop: 0
                }, 0);
                if ($('.navbar-collapse').hasClass('in')) {
                    $('.navbar-collapse').removeClass('in');
                }
                $timeout(function () {
                    bindCarSection();
                    bindUserSection();
                    setDDD();
                    footer();
                    $scope.viewReady = true;
                }, 500);
            }, 1000);
        };

        $scope.init = function () {
            AccountService.initializeUserOnLoad().then(function () {
                $scope.user_ready = true;
                $scope.user = initUserModel($scope.user);
                if (app.debug) {
                    console.log('LOGIN BY', $scope.user);
                }
            }).catch(function (err) {
                if (app.debug) {
                    console.log('NOT LOGIN, ANONIMOUS USER');
                }
                $scope.user_ready = true;
            });
            StringService.getStrings().success(function (strings) {
                $scope.strings = strings;
                $scope.strings_ready = true;
            });
            if (error_404 || error_500) {
                $scope.displayView();
            }
        };

        $scope.navigateTo = function (url, isRedirect) {
            if (url === '#/new-car' && $scope.user.max_car < $('.car-item').length) {
                $scope.max_car = true;
            }
            else {
                $scope.max_car = false;
                if (isRedirect) {
                    $rootScope.$broadcast(Event.Load.Display);
                    window.location.href = url;
                }
                else {
                    if (url !== window.location.hash) {
                        $rootScope.$broadcast(Event.Load.Display);
                        if (!window.location.hash) {
                            if (url == '#/') {
                                window.location.href = '/';
                            }
                            else {
                                window.location.href = url;
                            }
                        }
                        else {
                            $scope.displayLogin = false;
                            window.location.hash = url;
                        }
                    }
                }
            }
            
        };

        $scope.upload = function (files) {
            $scope.uploading = true;
            $('#invalidFile').hide();
            if (files && files.length) {
                var file = files[0];
                if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif') {
                    console.log($scope.upload_car_id);
                    FileService.upload(files[0], $scope.upload_car_id).then(function (file) {
                        $rootScope.$broadcast(Event.File.Success, file);
                        $scope.uploading = false;
                        $('#fileUpload').val('');
                    }).catch(function (res) {
                        if (res.error && res.error.message == 'MAX_FILE') {
                            $rootScope.$broadcast(Event.Message.Display, 'พื้นที่เก็บไฟล์สำหรับรถคันนี้เต็มแล้ว กรุณาติดต่อผู้ดูแลระบบเพื่ออัพเกรดพื้นที่เก็บไฟล์');
                        }
                        else {
                            $rootScope.$broadcast(Event.Message.Display, 'อัพโหลดไฟล์ล้มเหลวกรุณาลองอีกครั้ง');
                        }
                        $('#fileUpload').val('');
                        $scope.uploading = false;
                    });
                }
                else {
                    $('#fileUpload').val('');
                    $scope.uploading = false;
                    $('#invalidFile').show();
                }
            }
        };

        $scope.$on(Event.User.Update, function () {
            $scope.user = window.carcare.user;
        });

        $scope.$on(Event.Car.Clear, function () {
            angular.forEach($scope.cars, function (car) {
                car.active = false;
            });
        });

        $scope.$on(Event.Car.Update, function (event, cars) {
            $scope.cars = cars;
        });

        $scope.$on(Event.Car.SetActive, function (event, id) {
            angular.forEach($scope.cars, function (c) {
                if (c.id == id) {
                    c.active = true;
                }
                else {
                    c.active = false;
                }
            });
        });

        $scope.$on('$includeContentLoaded', function (event) {
           
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            $rootScope.$broadcast(Event.Load.Display);
            $scope.viewReady = false;
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
     
        });

        $scope.logout = function () {
            $rootScope.$broadcast(Event.Load.Display);
            AccountService.logout().then(function () {
                $cookies.remove('Authorization', { path: '/' });
                window.location.href = '/';
            }).catch(function (err) {
                $cookies.remove('Authorization', { path: '/' });
                //window.location.href = '/';
                console.log(err);
            });
           
        };

        $scope.loginToggle = function () {
            $scope.displayLogin = !$scope.displayLogin;
            if ($scope.displayLogin) {
                $timeout(function () {
                    FB.XFBML.parse();
                }, 100);
            }
        };

        var navs = ['isHomePage', 'isSharePage', 'isUsersPage', 'isCarPage', 'isWorksPage', 'isPage', 'isPaymentPage', 'isShopPage'];
        $scope.setNavActive = function (active) {
            angular.forEach(navs, function (n) {
                if (n === active) {
                    $scope[active] = true;
                }
                else {
                    $scope[n] = false;
                }
            });
        };

        $scope.$watch(function () {
            return location.hash
        }, function (value) {
            if (location.hash.indexOf('notification') > -1 || location.hash.indexOf('repair') > -1 || location.hash.indexOf('shares') > -1 || location.hash.indexOf('shops') > -1) {
                $scope.mainClass = 'opacity-theme';
            }
            else {
                $scope.mainClass = '';
            }
            if (location.hash == '/#/' || location.hash == '#/') {
                $scope.setNavActive('isHomePage');
            }
            else if (location.hash.indexOf('shares') > -1 || location.href.indexOf('share') > -1) {
                $scope.setNavActive('isSharePage');
            }
            else if (location.hash.indexOf('user') > -1) {
                $scope.setNavActive('isUsersPage');
            }
            else if (location.hash.indexOf('car') > -1) {
                $scope.setNavActive('isCarPage');
            }
            else if (location.hash.indexOf('works') > -1) {
                $scope.setNavActive('isWorksPage');
            }
            else if (location.hash.indexOf('page') > -1) {
                $scope.setNavActive('isPage');
            }
            else if (location.href.indexOf('payment') > -1) {
                $scope.setNavActive('isPaymentPage');
            }
            else if (location.href.indexOf('shops') > -1) {
                $scope.setNavActive('isShopPage');
            }
            else {
                $scope.setNavActive('');
            }
            $scope.upload_car_id =''
        });

        $scope.$on(Event.Car.IDForUpload, function (event, id) {
            $timeout(function () {
                $scope.upload_car_id = id;
            }, 500);
        });

        $scope.init();
}]);
