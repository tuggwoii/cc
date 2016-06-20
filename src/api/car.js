'use strict';
var Car = require('../database/models').Car;
var File = require('../database/models').File;
var User = require('../database/models').User;
var BaseApi = require('./base');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
//shortid.generate();

class CarApi extends BaseApi {

    validate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.brand) {
                reject('BRAND REQUIRED');
            }
            else if (!data.series) {
                reject('SERIES REQUIRED');
            }
            else if (!data.serial) {
                reject('SERIAL REQUIRED');
            }
            else {
                resolve();
            }
        })
        return promise;
    }

    getAll(context, req, res) {
        Car.all({include: [
            { model: User },
            { model: File }
        ]}).then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    model(data, owner) {
        return {
            name: data.name,
            serial: data.serial,
            brand: data.brand,
            series: data.series,
            image: data.image,
            owner: owner,
            year: data.year,
            date: data.date
        }
    }

    delete (context, req, res) {
        if (req.params.id) {
            Car.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
    }

    add (context, req, res) {
        var data = context.model(req.body, req.user.id);
        context.validate(data).then(function () {
            Car.create(data, { isNewRecord: true }).then(function (model) {
                context.success(req, res, model);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }).catch(function (err) {
            var error = {
                message: err
            };
            context.error(req, res, error, 400);
        });
    }

    endpoints() {
        return [
			{ url: '/cars', method: 'get', roles: ['admin', 'user'], response: this.getAll },
            { url: '/cars', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/cars', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new CarApi();