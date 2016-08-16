module.directive('time', ['Helper', function (Helper) {
    return {
        restrict: 'E',
        template: '<span>{{time_str}}</span>',
        scope: {
            val: '=val',
            dateonly:'=dateonly'
        },
        link: function (scope, element, attrs) {
            if (scope.dateonly) {
                scope.time_str = Helper.readableDate(scope.val);
            }
            else {
                scope.time_str = Helper.readableDateTime(scope.val);
            }         
        }
    };
}]);