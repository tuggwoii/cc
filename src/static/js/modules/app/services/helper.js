'use strict';
module.factory('Helper', [function () {

    return {
        monthArray: function () {
            var months = [];
            for (var i = 1; i <= 12; i++) {
                months.push(i);
            }
            return months;
        },
        dateArray: function () {
            var dates = [];
            for (var i = 1; i <= 31; i++) {
                dates.push(i);
            }
            return dates;
        }
    };
}]);
