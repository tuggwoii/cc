module.directive('fileUpload', ['$timeout', 'Event', function ($timeout, Event) {
    return {
        restrict: 'E',
        templateUrl: '/partials/upload.html',
        scope: {
            callback: '=upload'
        },
        link: function (scope, element, attrs) {
            element.unbind('change');
            element.bind('change', function (event) {
                if (scope.callback) {
                    scope.callback(event.target.files);
                }
            });
        }
    };
}]);