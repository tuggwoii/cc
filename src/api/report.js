'use strict';
var Report = require('../database/models').Report;
var File = require('../database/models').File;
var RepairImage = require('../database/models').RepairImage;
var BaseApi = require('./base');
var url = require('url');
var fs = require('fs');
var randomstring = require('randomstring');
var captchas = {};
var limits = 100;

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

    queryByImageId(id) {
        var promise = new Promise(function (resolve, reject) {
            Report.all({
                where: { file_id: id },
                include: [
                    { model: File }
                ]
            }).then(function (data) {
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
            else if (!captchas[data.key] || (captchas[data.key] && (captchas[data.key] != data.captcha))) {
                console.log(captchas);
                reject('INVALID CAPTCHA');
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

    getAll(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;

        var p = 1;
        if (queries['p']) {
            p = parseInt(queries['p']);
        }
        var _limit = limits;
        var skip = limits * (p - 1);

        var conditions = {};
        if (queries['q']) {
            var _or = {
                email: { like: '%' + queries['q'] + '%' },
                message: { like: '%' + queries['q'] + '%' },
                name: { like: '%' + queries['q'] + '%' }
            };
            conditions = {
                $or: _or
            };
        }

        Report.all({
            where: conditions,
            include: [
                { model: File }
            ],
            offset: skip,
            limit: limits
        }).then(function (data) {
            Report.count({
                where: conditions
            }).then(function (count) {
                var meta = {
                    count: count,
                    limits: _limit
                };
                context.success(req, res, data, meta);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
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
        context.validateCreate(req.body).then(function () {
            var data = context.model(req.body);
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

    deleteImage(context, req, res) {
        if (req.params.id) {
            context.queryByImageId(req.params.id).then(function (_reports) {
                var _report = _reports[0];
                var file_url = appRoot + _report.file.url;
                console.log(file_url);
                _report.file_id = null;
                _report.save(['file_id']).then(function (_newReport) {
                    RepairImage.destroy({ where: { image_id: req.params.id } }).then(function () {
                        File.destroy({ where: { id: req.params.id } }).then(function () {
                            fs.unlinkSync(file_url);
                            context.success(req, res, {});
                        }).catch(function (err) {
                            context.error(req, res, err, 500);
                        });
                    }).catch(function (err) {
                        context.error(req, res, err, 500);
                    });
                }).catch(function (err) {
                    context.error(req, res, err, 500);
                });
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.notfound();
        }
    }

    captcha(context, req, res) {
        var key = randomstring.generate({
            length: 6,
            charset: '0123456789'
        });
        var captcha = {
            key: key,
            captcha: randomstring.generate(6)
        };
        captchas[key] = captcha.captcha;
        context.success(req, res, captcha);
    }

    endpoints() {
        return [
            { url: '/reports/captcha', method: 'get', roles: [], response: this.captcha },
            { url: '/reports', method: 'get', roles: ['admin'], response: this.getById, params: ['id'] },
            { url: '/reports/image', method: 'delete', roles: ['admin'], response: this.deleteImage, params: ['id'] },
            { url: '/reports', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/reports', method: 'post', roles: [], response: this.add },
            { url: '/reports', method: 'patch', roles: ['admin'], response: this.update },
            { url: '/reports', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new ReportApi();