'use strict';
var BaseApi = require('./base');
var Role = require('../database/models').Role;

class RoleApi extends BaseApi {

    validate (data) {
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

    getAll (context, req, res) {
        Role.all().then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    model (data) {
        return {
            name: data.name
        }
    }

    delete (context, req, res) {
        if (req.params.id) {
            Role.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, { });
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
    }

    add (context, req, res) {
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

    endpoints () {
        return [
			{ url: '/roles', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/roles', method: 'post', roles: ["admin"], response: this.add },
            { url: '/roles', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new RoleApi();