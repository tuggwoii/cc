'use strict';
var File = require('../database/models').File;
var shortid = require('shortid');
var BaseApi = require('./base');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
//shortid.generate();

class FileApi extends BaseApi {

    validate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data || !data.name) {
                reject('INVALID DATA');
            }
            else {
                resolve();
            }
        })
        return promise;
    }

    getAll(context, req, res) {
        File.all().then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    model(data) {
        return {
            name: data.name
        }
    }

    delete (context, req, res) {
        if (req.params.id) {
            Role.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
    }

    add(context, req, res) {
        var data = context.model(req.body);
        context.validate(data).then(function () {
            Role.create(data, { isNewRecord: true }).then(function (model) {
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
			{ url: '/files', method: 'get', roles: ['admin', 'user'], response: this.getAll },
            { url: '/files', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/files', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new FileApi();