module.directive('confirm', ['$timeout', 'Event', function ($timeout, Event) {
    return {
        restrict: 'E',
        templateUrl: 'partials/confirm.html',
        scope: {
            
        },
        link: function (scope, element, attrs) {
            scope.display = false;
            function close () {
                $timeout(function () {
                    scope.animation = 'fadeOut';
                }, 150);
                $timeout(function () {
                    scope.display = false;
                }, 1000);
            }

            scope.$on(Event.Confirm.Dismiss, function () {
                close();
            });

            scope.$on(Event.Confirm.Display, function (event, callback, message) {
                scope.animation = 'fadeIn';
                scope.display = true;
                scope.callback = callback;
                if (!message) {
                    scope.message = 'คุณยืนยันที่จะลบข้อมูลนี้ออกจากระบบหรือไม่?';
                }
                else {
                    scope.message = message;
                }
                scope.no = function () {
                    close();
                }

            });
        }
    };
}]);