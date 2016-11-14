'use strict';
exports.current = function () {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "_" + month + "_" + day + "_" + hour + "_" + min + "_" + sec;
};

exports.getDayNumOfMonth = function (month, year) {
    if (month == 1 ||
        month == 3 ||
        month == 5 ||
        month == 7 ||
        month == 8 ||
        month == 10 ||
         month == 12
        ) {
        return 31;
    }
    else if (month == 2) {
        return 28 + (parseInt(year) % 4 == 0 ? 1 : 0);
    }
    else {
        return 30;
    }
};