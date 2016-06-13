'use strict';
var fs = require('fs');
var BaseApi = require('./base');

class StaticApi extends BaseApi {

    nav (context, req, res) {
        fs.readFile('./src/database/routes/apis.json', 'utf-8', function (err, content) {
            if (err) {
                context.error(req, res, err, 500);
            }
            else {
                context.success(req, res, JSON.parse(content), function (data) {
                    return data;
                });
            }
        });
    }

    endpoints () {
        return [
			{ url: '/backend/navigations', method: 'get', roles: ['admin', 'user'], response: this.nav }
        ];
    }
}

module.exports = new StaticApi();
