module.directive('time', ['Helper', function (Helper) {
    return {
        restrict: 'E',
        template: '<span>{{time_str}}</span>',
        scope: {
            val: '=val',
            dateonly:'=dateonly'
        },
        link: function (scope, element, attrs) {
            console.log(scope.val);
            if (scope.dateonly) {
                scope.time_str = Helper.readableDate(scope.val);
            }
            else {
                scope.time_str = Helper.readableDateTime(scope.val);
            }         
        }
    };
}]);