'use strict';
var Car = require('../database/models').Car;
var Setting = require('../database/models').Setting;
var User = require('../database/models').User;
var BaseApi = require('./base');
var url = require('url');

class SettingApi extends BaseApi {

    model(data) {
        var model = {
            exp_year: data.y,
            exp_month: data.m,
        };
        if (data.id) {
            model.id = data.id;
        }
        return model;
    }

    validate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.id) {
                reject('INVALID ID');
            }
            else if (!data.exp_year && data.exp_year != '0') {
                reject('YEAR REQUIRED');
            }
            else if (!data.exp_month && data.exp_month != '0') {
                reject('MONTH REQUIRED');
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    get(context, req, res) {
        Setting.all().then(function (data) {
            var _setting = data && data.length ? data[0] : '';
            if (_setting) {
                context.success(req, res, _setting);
            }
            else {
                context.notfound();
            }
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    setAllCar(context, req, res) {
        Setting.all().then(function (data) {
            var _setting = data && data.length ? data[0] : '';
            if (_setting) {
                context.success(req, res, _setting);
            }
            else {
                context.notfound();
            }
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    update (context, req, res) {
        var model = context.model(req.body);
        context.validate(model).then(function () {
            Setting.all().then(function (data) {
                var _setting = data && data.length ? data[0] : '';
                if (_setting) {
                    _setting.updateAttributes(model).then(function () {
                        context.success(req, res, { message: 'success' });
                    });
                }
                else {
                    context.notfound();
                }
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }).catch(function (err) {
            context.error(req, res, { message: err }, 400);
        });
    }

    endpoints () {
        return [
            { url: '/settings', method: 'get', roles: ['admin'], response: this.get },
            { url: '/settings', method: 'patch', roles: ['admin'], response: this.update },
            { url: '/settings/cars', method: 'post', roles: ['admin'], response: this.setAllCar }
        ];
    }
}

module.exports = new SettingApi();