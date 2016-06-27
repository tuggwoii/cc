module.directive('load', ['$timeout', 'Event', function ($timeout, Event) {
    return {
        templateUrl: 'partials/load.html',
        scope: {
            
        },
        link: function (scope, element, attrs) {
            scope.display = true;

            scope.$on(Event.Load.Dismiss, function () {
                $timeout(function () {
                    scope.animation = 'fadeOut';
                }, 500);
                $timeout(function () {
                    scope.display = false;
                }, 1500);
            });

            scope.$on(Event.Load.Display, function () {
                scope.animation = 'fadeIn';
                scope.display = true;
            });
        }
    };
}]);