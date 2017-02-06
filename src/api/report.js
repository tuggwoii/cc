'use strict';
var Report = require('../database/models').Report;
var BaseApi = require('./base');

class ReportApi extends BaseApi {

    queryById (id) {
        var promise = new Promise(function (resolve, reject) {
            Report.findById(id).then(function (data) {
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
                reject('NAME REQUIRED');
            }
            else if (!data.email) {
                reject('EMAIL REQUIRED');
            }
            else if (!data.message) {
                reject('MESSAGE REQUIRED');
            }
            else if (!data.file_id) {
                reject('FILE REQUIRED');
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
            else if (!data.name) {
                reject('NAME REQUIRED');
            }
            else if (!data.email) {
                reject('EMAIL REQUIRED');
            }
            else if (!data.message) {
                reject('MESSAGE REQUIRED');
            }
            else if (!data.file_id) {
                reject('FILE REQUIRED');
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    model(data) {
        var model = {
            name: data.name,
            email: data.email,
            message: data.message,
            file_id: data.file_id
        };
        if (data.id) {
            model.id = data.id;
        }
        return model;
    }

    getAll (context, req, res) {
        Report.all().then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    

    update (context, req, res) {
        var model = context.model(req.body);
        context.validateUpdate(model).then(function () {
            context.queryById(model.id).then(function (_model) {
                if (_model) {
                    _model.updateAttributes(model).then(function (_updated_model) {
                        context.success(req, res, _updated_model);
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
            Report.destroy({ where: { id: req.params.id } }).then(function (model) {
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
            Report.create(data, { isNewRecord: true }).then(function (model) {
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

    getById (context, req, res) {
        if(req.params.id) {
            context.getById().then(function(data) {
                if(data) {
                    context.success(req, res, data);
                }
                else {
                    context.notfound(res);
                }
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
            { url: '/reports', method: 'get', roles: ['admin'], response: this.getById, params: ['id'] },
            { url: '/reports', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/reports', method: 'post', roles: [], response: this.add },
            { url: '/reports', method: 'patch', roles: ['admin'], response: this.update },
            { url: '/reports', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new ReportApi();