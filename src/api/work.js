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

class RepairApi extends BaseApi {

    model(data, user) {
        var model = {
            detail: data.detail,
            work: data.work,
            owner: user,
            price: 0.00,
            for_repair: data.repair
        };
        if (data.id) {
            model.id = data.id;
            if (data.price) {
                model.price = data.price;
            }
        }
        return model;
    }

    validateCreate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
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
            var promise = new Promise(function (resolve, reject) {
                if (!data) {
                    reject('INVALID DATA');
                }
                else if (!data.id) {
                    reject('ID REQUIRED');
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
        });
        return promise;
    }

    getRepairByUserId(id, carId, limits, skip) {
        var promise = new Promise(function (resolve, reject) {
            var conditions = {
                owner: id
            };
            Repair.findAll({
                where: conditions,
                order: [["createdAt", "DESC"]],
                include: [
                    { model: Work },
                    { model: User },
                    { model: Repair }
                ],
                offset: skip,
                limit: limits
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err)
            });
        });
        return promise;
    }

    countRepairByUserId(id, carId) {
        var promise = new Promise(function (resolve, reject) {
            var conditions = {
                owner: id
            };
            if (carId) {
                conditions['for_car'] = carId;
            }
            Repair.count({ where: conditions }).then(function (count) {
                resolve(count)
            }).catch(function (err) {
                reject(err)
            });
        });
        return promise;
    }

    getRepairById(id) {
        var promise = new Promise(function (resolve, reject) {
            Repair.findById(id, {
                include: [
                    { model: Car },
                    { model: Work },
                    { model: User },
                    { model: Shop }
                ]
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    getByUser(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var p = 1;
        var carId;
        if (queries['p']) {
            p = parseInt(queries['p']);
        }
        if (queries['c']) {
            carId = parseInt(queries['c']);
        }
        var skip = limits * (p - 1);

        context.getRepairByUserId(req.user.id, carId, limits, skip).then(function (data) {
            context.countRepairByUserId(req.user.id, carId).then(function (count) {
                var meta = {
                    count: count,
                    limits: limits
                };
                context.success(req, res, data, meta);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    getAll(context, req, res) {
        Notification.all({
            include: [
                { model: Car },
                { model: Work },
                { model: User }
            ]
        }).then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    getById(context, req, res) {
        if (req.params.id) {
            context.getRepairById(req.params.id).then(function (_repair) {
                if (_repair) {
                    var owner = _repair.owner;
                    if (req.user.id === owner) {
                        context.success(req, res, _repair);
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

    add(context, req, res) {
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
        var repair = context.model(req.body, req.user.id);
        var shopId = repair.repair_shop;
        context.validateUpdate(repair).then(function () {
            context.getRepairById(repair.id).then(function (_repair) {
                if (_repair) {
                    var owner = _repair.owner;
                    var score = _repair.score;
                    var old_shopId = _repair.repair_shop;
                    if (req.user.id === owner) {
                        _repair.updateAttributes(repair).then(function (_updated_repair) {
                            if (repair.score != score || shopId != old_shopId) {
                                context.updateShopScore(context, req, res, shopId).then(function () {
                                    if (shopId != old_shopId) {
                                        context.updateShopScore(context, req, res, old_shopId).then(function () {
                                            context.success(req, res, _updated_repair);
                                        }).catch(function (err) {
                                            context.error(req, res, err, 500);
                                        });
                                    }
                                    else {
                                        context.success(req, res, _updated_repair);
                                    }
                                }).catch(function (err) {
                                    context.error(req, res, err, 500);
                                });
                            }
                            else {
                                context.success(req, res, _updated_repair);
                            }
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
            { url: '/works', method: 'get', roles: ['admin', 'user'], response: this.getByUser },
            { url: '/works', method: 'get', roles: ['admin', 'user'], response: this.getById, params: ['id'] },
            { url: '/works', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/works', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/works', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new RepairApi();