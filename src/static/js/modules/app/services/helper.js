'use strict';
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
            return date.getDate() + ' ' + this.monthsFull[date.getMonth()] + ' ' + date.getFullYear();
        }
    };
}]);
