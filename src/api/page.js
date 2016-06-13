'use strict';
var BaseApi = require('./base');
var Pages = require('../models/page');
var log = require('../helpers/log');

class PagesApi extends BaseApi {

    create (context, request, response) {
        var data = request.body;
        if (Pages.isValid(data)) {
            Pages.create(data).then(function () {
                context.success(response, data);
            }).catch(function (err) {
                context.error(response, 'Internal server error', 500);
                log.file(err.message);
            });
        }
        else {
            context.error(response, 'Model is invalid', 400);
        }
    }

    endpoints () {
        return [
			{ url: '/pages', method: 'post', roles: ['admin'], response: this.create }
        ];
    }
}

module.exports = new PagesApi(Pages.serialize);
