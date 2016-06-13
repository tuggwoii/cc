'use strict';
var fs = require('fs');
var date = require('../helpers/date');

function log (message) {
    /* eslint-disable */
    console.log(message);
    /* eslint-enable */
}

exports.write = function (message) {
    log(message);
};


exports.logToDatabase = function (log) {
    var promise = new Promise(function (resolve, reject) {
        resolve();
    });
    return promise;
};
