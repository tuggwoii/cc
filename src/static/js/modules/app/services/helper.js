'use strict';
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
module.factory('Helper', [function () {
    return {
        monthsShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'ม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
        monthsFull: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม ', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
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
        readableDate: function (_date) {
            var date = new Date(_date);
            return date.getDate() + ' ' + this.monthsFull[date.getMonth()] + ' ' + (date.getFullYear() + 543);
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
            return hour + ':' + min + ':' + sec + ', ' + date.getDate() + ' ' + this.monthsFull[date.getMonth()] + ' ' + (date.getFullYear() + 543);
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
        }
    };
}]);
