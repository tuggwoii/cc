'use strict';
var fs = require('fs');
var date = require('../helpers/date');
var Log = require('../database/models').Log;

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
        Log.create(log, { isNewRecord: true }).then(function (model) {
            resolve(model);
        }).catch(function (err) {
            reject(err);
        });
    });
    return promise;
};
