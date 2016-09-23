'use strict';
var BaseApi = require('./base');
var Pages = require('../models/page');
var log = require('../helpers/log');

class PagesApi extends BaseApi {

    getAll (context, req, res) {
        Pages.getAll().then(function (data) {
            context.success(req, res, data, {}, Pages.serialize);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    create (context, req, res) {
        var data = req.body;
        if (Pages.isValid(data)) {
            Pages.create(data).then(function (_page) {
                context.success(req, res, _page, {}, Pages.serialize);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.error(response, 'INVALID MODEL', 400);
        }
    }

    update(context, req, res) {
        var data = req.body;
        if (Pages.isValid(data)) {
            Pages.update(data).then(function (_page) {
                context.success(req, res, _page, {}, Pages.serialize);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.error(response, 'INVALID MODEL', 400);
        }
    }

    delete (context, req, res) {
        if (req.params.id) {
            Pages.delete(req.params.id).then(function () {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.error(response, 'INVALID MODEL', 400);
        }
    }

    endpoints () {
        return [
            { url: '/pages', method: 'get', roles: ['admin'], response: this.getAll },
			{ url: '/pages', method: 'post', roles: ['admin'], response: this.create },
            { url: '/pages', method: 'patch', roles: ['admin'], response: this.update },
            { url: '/pages', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new PagesApi();
