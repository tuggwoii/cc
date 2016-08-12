module.directive('load', ['$timeout', 'Event', function ($timeout, Event) {
    return {
        restrict: 'E',
        templateUrl: '/partials/load.html',
        scope: {
            
        },
        link: function (scope, element, attrs) {
            scope.display = true;
            scope.$on(Event.Load.Dismiss, function (event, task) {
                if (scope.display) {
                    $timeout(function () {
                        scope.animation = 'fadeOut';
                    }, 500);
                    $timeout(function () {
                        scope.display = false;
                        $('body').focus();
                    }, 1000);
                }
            });

            scope.$on(Event.Load.Display, function (event, task) {
                if (!scope.display) {
                    scope.animation = 'fadeIn';
                    scope.display = true;
                }
            });
        }
    };
}]);