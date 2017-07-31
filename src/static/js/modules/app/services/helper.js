'use strict';
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
module.factory('Helper', [function () {
    var _monthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'ม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    var _monthsFull = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม ', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return {
        monthsShort: _monthsShort,
        monthsFull: _monthsFull,
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
        },
        getMonthListAsKeyPair: function() {
            var months = [];
            for (var i = 0; i < 12; i++) {
                months.push({
                    key: _monthsShort[i],
                    value: i
                });
            }
            return months;
        },
        getMonthListFullAsKeyPair: function () {
            var months = [];
            for (var i = 1; i <= 12; i++) {
                months.push({
                    key: _monthsFull[i - 1],
                    value: i
                });
            }
            return months;
        },
        readableMonth: function (month_number) {
            return _monthsFull[month_number - 1];
        },
        readableDate: function (_date) {
            var date = new Date(_date);
            return date.getDate() + ' ' + this.monthsFull[date.getMonth()] + ' ' + (date.getFullYear() + 543);
        },
        shortDate: function (_date) {
            var date = new Date(_date);
            return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getFullYear() + 543);
        },
        readableDateTime: function (_date) {
            var date = new Date(_date);
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (min < 10) {
                min = '0' + min;
            }
            if (sec < 10) {
                sec = '0' + sec;
            }
            return date.getDate() + ' ' + this.monthsFull[date.getMonth()] + ' ' + (date.getFullYear() + 543) + ', ' + hour + ':' + min + ':' + sec;
        },
        replaceUrl: function (str) {
            str = str.replaceAll(',', '-');
            str = str.replaceAll(' ', '-');
            str = str.replaceAll('.', '-');
            str = str.replaceAll('"', '-');
            str = str.replaceAll('?', '-');
            str = str.replaceAll('=', '-');
            str = str.replaceAll('&', '-');
            str = str.replaceAll('%', '-');
            str = str.replaceAll('%', '*');
            return str;
        },
        getQueryStringValue: function (param, dummyPath) {
            var sPageURL = dummyPath || window.location.search.substring(1),
                sURLVariables = sPageURL.split(/[&||?]/),
                res;
            for (var i = 0; i < sURLVariables.length; i += 1) {
                var paramName = sURLVariables[i],
                    sParameterName = (paramName || '').split('=');

                if (sParameterName[0] === param) {
                    res = sParameterName[1];
                }
            }
            return res;
        },
        mergeArray: function mergeArray(arr1, arr2) {
            angular.forEach(arr2, function (m) {
                arr1.push(m);
            });
            return arr1;
        }
    };
}]);
