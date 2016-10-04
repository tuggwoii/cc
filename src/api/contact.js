'use strict';
var BaseApi = require('./base');
var Contact = require('../database/models').Contact;
var Car = require('../database/models').Car;
var User = require('../database/models').User;

class ContactApi extends BaseApi {

    validate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data || !data.title || !data.type || !data.datetime) {
                reject('INVALID DATA');
            }
            else {
                resolve();
            }
        })
        return promise;
    }

    validateUpdate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data || !data.id || !data.title || !data.type || !data.datetime) {
                reject('INVALID DATA');
            }
            else {
                resolve();
            }
        })
        return promise;
    }

    model(data, user) {
        var model = {
            name: data.title,
            title: data.detail,
            type: data.type,
            send_by: user.id,
            car_model: data.car,
            datetime: data.datetime,
            status: 0
        };
        return model;
    }

    modelUpdate(data, user) {
        var model = {
            id: data.id,
            name: data.title,
            title: data.detail,
            type: data.type,
            send_by: user.id,
            car_model: data.car,
            datetime: data.datetime,
            status: data.status
        };
        return model;
    }

    getById(id) {
        var promise = new Promise(function (resolve, reject) {
            Contact.findById(id, {
                include: [
                    { model: Car },
                    { model: User }
                ]
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    getAll(context, req, res) {
        Contact.all({
            include: [
                { model: Car },
                { model: User }
            ]
        }).then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    get(context, req, res) {
        if (req.params.id) {
            context.getById(req.params.id).then(function (data) {
                if (data) {
                    resolve(data);
                }
                else {
                    context.notfound(res);
                }
            }).catch(function (err) {
                reject(err);
            });
        }
        else {
            context.notfound(res);
        }
    }


    add(context, req, res) {
        var data = context.model(req.body, req.user);
        context.validate(data).then(function () {
            Contact.create(data, { isNewRecord: true }).then(function (model) {
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

    update(context, req, res) {
        var data = context.modelUpdate(req.body, req.user);
        context.validateUpdate(data).then(function () {
            context.getById(data.id).then(function (_contact) {
                if (_contact) {
                    _contact.updateAttributes(data).then(function () {
                        resolve();
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    context.notfound(res);
                }
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            var error = {
                message: err
            };
            context.error(req, res, error, 400);
        });
    }

    delete (context, req, res) {
        if (req.params.id) {
            Contact.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.notfound(res);
        }
    }

    endpoints() {
        return [
			{ url: '/contacts', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/contacts', method: 'get', roles: ['admin', 'user'], response: this.get, params: ['id'] },
            { url: '/contacts', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/contacts', method: 'patch', roles: ['admin'], response: this.update },
            { url: '/contacts', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new ContactApi();