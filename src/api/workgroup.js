'use strict';
var Workgroup = require('../database/models').Workgroup;
var BaseApi = require('./base');

class WorkgroupApi extends BaseApi {

    getWorkById (id) {
        var promise = new Promise(function (resolve, reject) {
            Workgroup.findById(id).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    validateCreate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.name) {
                reject('NAMR REQUIRED');
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    validateUpdate (data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.id) {
                reject('INVALID ID');
            }
            else if (!data.name) {
                reject('NAMR REQUIRED');
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    getAll (context, req, res) {
        Workgroup.all().then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    model (data) {
        var model = {
            name: data.name,
        };
        if (data.id) {
            model.id = data.id;
        }
        return model;
    }

    update (context, req, res) {
        var work = context.model(req.body);
        context.validateUpdate(work).then(function () {
            context.getWorkById(work.id).then(function (_work) {
                if (_work) {
                    _work.updateAttributes(work).then(function (_updated_work) {
                        context.success(req, res, _updated_work);
                    }).catch(function (err) {
                        context.error(req, res, err, 500);
                    });
                }
                else {
                    context.notfound(res);
                }
            }).catch(function (err) {
                context.error(req, res, error, 500);
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
            Workgroup.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.notfound(res);
        }
    }

    add (context, req, res) {
        var data = context.model(req.body);
        context.validateCreate(data).then(function () {
            Workgroup.create(data, { isNewRecord: true }).then(function (model) {
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
            { url: '/workgroup', method: 'get', roles: [], response: this.getAll },
            { url: '/workgroup', method: 'post', roles: ['admin'], response: this.add },
            { url: '/workgroup', method: 'patch', roles: ['admin'], response: this.update },
            { url: '/workgroup', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new WorkgroupApi();