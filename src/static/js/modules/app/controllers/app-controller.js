'use strict';
module.controller('AppController', ['$scope', '$rootScope', '$timeout', '$cookies', '$q', 'AccountService', 'StringService', 'Event', 'FileService', 'WorkgroupService', 'CarService',
    function ($scope, $rootScope, $timeout, $cookies, $q, AccountService, StringService, Event, FileService, WorkgroupService, CarService) {

        $scope.strings_ready = false;
        $scope.user_ready = false;

        function clearWorksState() {
            angular.forEach($scope.workgroup, function (w) {
                w.active = false;
            });
        }

        $scope.displayView = function () {
            $timeout(function () {
                $rootScope.$broadcast(Event.Load.Dismiss);
                $("html, body").animate({
                    scrollTop: 0
                }, 0);
                $timeout(function () {
                    footer();
                    $scope.viewReady = true;
                }, 500);
            }, 1000);
        };

        $scope.init = function () {
            AccountService.initializeUserOnLoad().then(function () {
                $scope.user_ready = true;
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
                console.log(file.type);
                if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif') {
                    FileService.upload(files[0]).then(function (file) {
                        $rootScope.$broadcast(Event.File.Success, file);
                        $scope.uploading = false;
                        $('#fileUpload').val('');
                    }).catch(function () {
                        $('#fileUpload').val('');
                        alert('UPLOAD ERROR');
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
            $('footer').hide();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
     
        });

        $scope.logout = function () {
            $rootScope.$broadcast(Event.Load.Display, 'PAGE_CHANGE');
            AccountService.logout();
            $cookies.remove('Authorization', { path: '/' });
            window.location.href = '/';
        };

        $scope.loginToggle = function () {
            $scope.displayLogin = !$scope.displayLogin;
            if ($scope.displayLogin) {
                $timeout(function () {
                    FB.XFBML.parse();
                }, 100);
            }
        };

        var navs = ['isHomePage', 'isSharePage', 'isUsersPage', 'isCarsPage', 'isWorksPage', 'isPage'];
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
            if (location.hash.indexOf('notification') > -1 || location.hash.indexOf('repair') > -1 || location.hash.indexOf('shares') > -1) {
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
                $scope.setNavActive('isCarsPage');
            }
            else if (location.hash.indexOf('works') > -1) {
                $scope.setNavActive('isWorksPage');
            }
            else if (location.hash.indexOf('page') > -1) {
                $scope.setNavActive('isPage');
            }
            else {
                $scope.setNavActive('');
            }
        });

        $scope.init();
}]);
