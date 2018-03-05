'use strict';
var Log = require('../helpers/log');
module.exports = function (err, req, res, next) {

    var error = {
        url: req.url,
        data: req.body ? JSON.stringify(req.body) : '',
        params: req.params ? JSON.stringify(req.params) : '',
        message: err.message ? err.message : err ? err : '',
        stack: err.stack ? err.stack : '',
        status: 500
    };
    if (req.user) {
        error.user = req.user.id
    }

    Log.logToDatabase(error).then(function () {
        console.log('Some error has been logged');
    }).catch(function (err) {
        console.log('Can not log the error', err);
    });

    if (req.url.indexOf('/api/v1') > -1) {
        res.status(500).json({
            data: {},
            error: error,
            meta: {}
        });
    }
    else {
        res.status(500).render('pages/500.html');
    }
};
