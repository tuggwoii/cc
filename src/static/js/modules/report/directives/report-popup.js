module.directive('reportPopup', ['$rootScope', '$timeout', 'Event', 'ReportService', function ($rootScope, $timeout, Event, ReportService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/report-popup.html',
        scope: {
            
        },
        link: function (scope, element, attrs) {

            scope.display = false;

            function close() {
                $timeout(function () {
                    scope.animation = 'fadeOut';
                }, 150);
                $timeout(function () {
                    scope.display = false;
                }, 1000);
                $('body,html').css('overflow', '');
            }

            scope.close = function () {
                close();
            };

            scope.$on(Event.Report.Display, function (event, id, url) {
                scope.animation = 'fadeIn';
                scope.display = true;
                scope.login = false;
                scope.is_submit = false;
                scope.url = url;
                scope.model = {
                    file_id: id
                };
                if (window.carcare.user && window.carcare.user.id) {
                    scope.login = true;
                    scope.model.name = window.carcare.user.name;
                    scope.model.email = window.carcare.user.email;
                }
                $('body,html').css('overflow', 'hidden');
                scope.setHeight();
                console.log(scope.model);
            });

            scope.setHeight = function () {
                if ($(window).height() < $('.report-popup').height() + 150) {
                    var height = $(window).height() - 150;
                    if (height > 600) {
                        height = 600;
                    }
                    var half_height = height / 2;
                    $('.report-popup').height(height);
                    $('.report-popup').css('margin-top', -(half_height + 20) + 'px');
                }
                else {
                    $('.report-popup').height(600);
                }
            };

            scope.submit = function (form) {
                scope.is_submit = true;
                if (form.$valid) {
                    $rootScope.$broadcast(Event.Load.Display);
                    ReportService.send(scope.model).then(function () {
                        close();
                        $rootScope.$broadcast(Event.Load.Dismiss);
                        $rootScope.$broadcast(Event.Message.Display, 'ทางเราได้รับการแจ้งรูปภาพไม่เหมาะสมของท่านแล้วและจะรีบดำเนินการตรวจสอบให้เร็วที่สุด');
                    }).catch(function () {
                        close();
                        $rootScope.$broadcast(Event.Load.Dismiss);
                        $rootScope.$broadcast(Event.Message.Display, 'ส่งข้อความล้มเหลวกรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ');
                    });
                }
            };

            $(window).resize(scope.setHeight);
        }
    };
}]);