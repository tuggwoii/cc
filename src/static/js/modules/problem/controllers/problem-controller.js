'use strict';
module.controller('ProblemReportController', ['$scope', '$rootScope', '$timeout', '$q', '$location', 'ProblemService', 'Event', 'Helper',
    function ($scope, $rootScope, $timeout, $q, $location, ProblemService, Event, Helper) {

        function ProblemReportPage() {
            if ($scope.user_ready) {
                loadResources();
            }
            else {
                $timeout(function () {
                    ProblemReportPage();
                }, 200);
            }
        }

        function loadResources() {
            $q.all([
                ProblemService.captcha().then(function (res) {
                    $scope.captcha = res.data;
                    $scope.model.key = $scope.captcha.key;
                }).catch(function () {

                })
            ]).then(function () {
                $scope.displayView();
                });

            if (window.carcare.user) {
                if (window.carcare.user.name) {
                    $scope.model.name = window.carcare.user.name;
                }
                if (window.carcare.user.email) {
                    $scope.model.email = window.carcare.user.email;
                }
                if (window.carcare.user.telephone) {
                    $scope.model.telephone = window.carcare.user.telephone;
                }
            }
        }

        function resetForm(form) {
            angular.forEach(form.$$controls, function (field) {
                field.$setPristine();
            });
            $scope.is_submit = false;
            $scope.model = {};
            loadResources();
        }

        $scope.model = {
            captcha: '',
            key: '',
            name: '',
            email: '',
            telephone: ''
        };

        $scope.submit = function (form) {
            $scope.is_submit = true;
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            if (form.$valid && $scope.model.captcha === $scope.captcha.captcha) {
                $rootScope.$broadcast(Event.Load.Display);
                ProblemService.sendReport($scope.model).then(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $rootScope.$broadcast(Event.Message.Display, 'ทางเราได้รับการแจ้งปัญหาของท่านแล้วและจะรีบดำเนินการตรวจสอบให้เร็วที่สุด');
                    resetForm(form);
                }).catch(function () {
                    $rootScope.$broadcast(Event.Load.Dismiss);
                    $rootScope.$broadcast(Event.Message.Display, 'การแจ้งล้มเหลวกรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ');
                });
            }
        }

        ProblemReportPage();
    }]);
