'use strict';
var Repair = require('../database/models').Repair;
var User = require('../database/models').User;
var Car = require('../database/models').Car;
var Workgroup = require('../database/models').Workgroup;
var RepairWork = require('../database/models').RepairWork;
var Shop = require('../database/models').Shop;
var BaseApi = require('./base');
var url = require('url');
var limits = 10;

class WorkApi extends BaseApi {

    model (data, user) {
        var work = {
            title: data.title,
            detail: data.detail,
            work: data.work,
            owner: user,
            price: data.price ? data.price : 0.00,
            for_repair: data.repair
        };
        if (data.id) {
            work.id = data.id;
            if (data.price) {
                work.price = data.price;
            }
            delete work['for_repair']
        }
        return work;
    }

    validateCreate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.title) {
                reject('TITLE REQUIRED');
            }
            else if (!data.for_repair) {
                reject('REPAIR REQUIRED');
            }
            else {
                if (data.for_repair) {
                    Repair.findById(data.for_repair).then(function (_repair) {
                        if (_repair) {
                            var repair = _repair.dataValues;
                            var owner = repair.owner;
                            if (owner == data.owner) {
                                resolve();
                            }
                            else {
                                reject('REPAIR NOT OWNER');
                            }
                        }
                        else {
                            reject('REPAIR NOT FOUND');
                        }
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    reject('INVALID REPAIR');
                }
            }
        });
        return promise;
    }

    validateUpdate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.id) {
                reject('ID REQUIRED');
            }
            else if (!data.title) {
                reject('TITLE REQUIRED');
            }
            else {
                RepairWork.findById(data.id).then(function (_work) {
                    if (_work) {
                        var work = _work.dataValues;
                        if (work.owner == data.owner) {
                            resolve(_work);
                        }
                        else {
                            reject('WORK NOT OWNER');
                        }
                    }
                    else {
                        reject('WORK NOT FOUND');
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
        return promise;
    }


    add (context, req, res) {
        var work = context.model(req.body, req.user.id);
        context.validateCreate(work).then(function () {
            RepairWork.create(work, { isNewRecord: true }).then(function (_work) {
                context.success(req, res, _work);
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
        console.log('here');
        var work = context.model(req.body, req.user.id);
        console.log(work);
        context.validateUpdate(work).then(function (_work) {
            if (_work) {
                var owner = _work.owner;
                if (req.user.id === owner) {
                    _work.updateAttributes(work).then(function (_updated_work) {
                        context.success(req, res, _updated_work);
                    }).catch(function (err) {
                        context.error(req, res, err, 500);
                    });
                }
                else {
                    context.denied(res);
                }
            }
            else {
                context.notfound(res);
            }
        }).catch(function (err) {
            var error = {
                message: err
            };
            context.error(req, res, error, 400);
        });
    }

    delete (context, req, res) {
        if (req.params.id) {
            RepairWork.findById(req.params.id, {
                include: [
                    { model: User }
                ]
            }).then(function (_work) {
                if (_work) {
                    var owner = _work.owner;
                    if (req.user.id === owner) {
                        RepairWork.destroy({ where: { id: req.params.id, owner: req.user.id } }).then(function () {
                            context.success(req, res, {});
                        }).catch(function (err) {
                            context.error(req, res, err, 500);
                        });
                    }
                    else {
                        context.denied(res);
                    }
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
            { url: '/works', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/works', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/works', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new WorkApi();