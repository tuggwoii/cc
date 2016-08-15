'use strict';
var fs = require('fs');
var Repair = require('../database/models').Repair;
var User = require('../database/models').User;
var Car = require('../database/models').Car;
var Work = require('../database/models').Workgroup;
var Shop = require('../database/models').Shop;
var File = require('../database/models').File;
var RepairImage = require('../database/models').RepairImage;
var RepairWork = require('../database/models').RepairWork;
var RepairSerializer = require('../serializers/repair-serializer');
var BaseApi = require('./base');
var url = require('url');
var limits = 10;

class RepairApi extends BaseApi {

    model(data, user) {
        var model = {
            title: data.title,
            mile: data.mile,
            date: data.date,
            remark: data.remark,
            work: data.work,
            for_car: data.car,
            owner: user,
            share: data.share,
            score: data.score,
            price: data.price
        };
        if (data.id) {
            model.id = data.id;
            model.for_car = data.car.id
            if (data.repair_works) {
                model.repair_works = data.repair_works;
            }
        }
        if (data.shop) {
            model.repair_shop = data.shop.id;
        }
        return model;
    }

    validateCreate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.title) {
                reject('TITLE REQUIRED');
            }
            else if (!data.mile) {
                reject('MILE REQUIRED');
            }
            else if (!data.work) {
                reject('WORK REQUIRED');
            }
            else if (!data.for_car) {
                reject('CAR REQUIRED');
            }
            else if (!data.date) {
                reject('DATE REQUIRED');
            }
            else {
                if (data.for_car) {
                    Car.findById(data.for_car).then(function (_car) {
                        if (_car) {
                            var car = _car.dataValues;
                            var owner = car.owner;
                            if (owner == data.owner) {
                                var car_exp = new Date(car.exp_date);
                                var curr_date = new Date();
                                if (curr_date <= car_exp) {
                                    resolve();
                                }
                                else {
                                    reject('CAR EXPIRE');
                                }
                            }
                            else {
                                reject('CAR NOT OWNER');
                            }
                        }
                        else {
                            reject('CAR NOT FOUND');
                        }
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    reject('INVALID CAR');
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
            else if (!data.mile) {
                reject('MILE REQUIRED');
            }
            else if (!data.work) {
                reject('WORK REQUIRED');
            }
            else if (!data.for_car) {
                reject('CAR REQUIRED');
            }
            else if (!data.date) {
                reject('DATE REQUIRED');
            }
            else {
                if (data.for_car) {
                    Car.findById(data.for_car).then(function (_car) {
                        if (_car) {
                            var car = _car.dataValues;
                            var owner = car.owner;
                            if (owner == data.owner) {
                                var car_exp = new Date(car.exp_date);
                                var curr_date = new Date();
                                if (curr_date <= car_exp) {
                                    resolve();
                                }
                                else {
                                    reject('CAR EXPIRE');
                                }
                            }
                            else {
                                reject('CAR NOT OWNER');
                            }
                        }
                        else {
                            reject('CAR NOT FOUND');
                        }
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    reject('INVALID CAR');
                }
            }
        });
        return promise;
    }

    getRepairByUserId(id, queries, limits, skip) {
        var promise = new Promise(function (resolve, reject) {
            Repair.findAll({
                where: queries,
                order: [["createdAt", "DESC"]],
                include: [
                    { model: Car },
                    { model: Work },
                    { model: User },
                    { model: Shop },
                    { model: RepairWork }
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

    countRepairByUserId(id, queries) {
        var promise = new Promise(function (resolve, reject) {
            Repair.count({
                where: queries
            }).then(function (count) {
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
                    { model: Shop },
                    { model: RepairWork, include: [{ model: Work }] },
                    { model: RepairImage, include: [{ model: File }] }
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
        if (queries['p']) {
            p = parseInt(queries['p']);
        }
        var skip = limits * (p - 1);

        var q = {
            owner: req.user.id,
            price: { }
        };
        if (queries['car']) {
            q.for_car = parseInt(queries['car']);
        }
        if (queries['work']) {
            q.work = parseInt(queries['work']);
        }
        if (queries['title']) {
            q.title = { like: '%' + queries['title'] + '%' };
        }
        if (queries['lp']) {
            q.price.$gte = parseInt(queries['lp']);
        }
        if (queries['hp']) {
            q.price.$lte = parseInt(queries['hp']);
        }
        if (!q.price.$gte && !q.price.$lte) {
            delete q['price'];
        }
        if (queries['rating']) {
            q.score = parseInt(queries['rating']);
        }

        context.getRepairByUserId(req.user.id, q, limits, skip).then(function (data) {
            context.countRepairByUserId(req.user.id, q).then(function (count) {
                var meta = {
                    count: count,
                    limits: limits
                };
                context.success(req, res, data, meta, RepairSerializer.default);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    getAll(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var items = 20;
        var p = 1;
        if (queries['p']) {
            p = parseInt(queries['p']);
        }
        if (queries['limits']) {
            items = parseInt(queries['limits']);
        }
        var skip = items * (p - 1);

        var q = {
            share: true,
            price: {}
        };
        if (queries['work']) {
            q.work = parseInt(queries['work']);
        }
        if (queries['title']) {
            q.title = { like: '%' + queries['title'] + '%' };
        }
        if (queries['lp']) {
            q.price.$gte = parseInt(queries['lp']);
        }
        if (queries['hp']) {
            q.price.$lte = parseInt(queries['hp']);
        }
        if (!q.price.$gte && !q.price.$lte) {
            delete q['price'];
        }
        if (queries['rating']) {
            q.score = parseInt(queries['rating']);
        }
        Repair.all({
            where: q,
            order: [["updatedAt", "DESC"]],
            include: [
                { model: Car, include: [{ model: File }]},
                { model: Work },
                { model: User, include: [{ model: File }] },
                { model: Shop },
                { model: RepairWork }
            ],
            offset: skip,
            limit: items
        }).then(function (data) {
            Repair.count(q).then(function (count) {
                var meta = {
                    count: count,
                    limits: items
                };
                context.success(req, res, data, meta, RepairSerializer.share);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
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
                        context.success(req, res, _repair, {}, RepairSerializer.default);
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

    getShopById(id) {
        var promise = new Promise(function (resolve, reject) {
            Shop.findById(id, {
                include: [
                    { model: Repair }
                ]
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    getWorkById(id) {
        var promise = new Promise(function (resolve, reject) {
            RepairWork.findById(id).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    calculateShopScore(repairs) {
        var score = 0.00;
        if (repairs.length) {
            for (var i = 0; i < repairs.length; i++) {
                score += repairs[i].score;
            }
        }
        if (score > 0) {
            score = score / repairs.length;
        }
        return score;
    }

    updateShopScore(context, shopId) {
        var promise = new Promise(function (resolve, reject) {
            context.getShopById(shopId).then(function (_shop) {
                if (_shop) {
                    var shop_str = JSON.stringify(_shop);
                    var shop = JSON.parse(shop_str);
                    var repairs = shop.repairs;
                    shop.rating = context.calculateShopScore(repairs);
                    _shop.updateAttributes(shop).then(function () {
                        resolve();
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    reject('NOT FOUND');
                }
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    updateWork(work, context) {
        var promise = new Promise(function (resolve, reject) {
            context.getWorkById(work.id).then(function (_work) {
                if (_work) {
                    _work.updateAttributes(work).then(function () {
                        resolve();
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    resolve();
                }
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    updateWorks(context, works) {
        var promise = new Promise(function (resolve, reject) {
            var index = 0;
            var current = works[index];
            function updates(work, index, works) {
                context.updateWork(work, context).then(function () {
                    var next = index + 1;
                    if (next < works.length) {
                        updates(works[next], next, works);
                    }
                    else {
                        resolve();
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
            if (works.length > 0) {
                updates(current, index, works);
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    add(context, req, res) {
        var repair = context.model(req.body, req.user.id);
        var shopId = repair.repair_shop;
        context.validateCreate(repair).then(function () {
            Repair.create(repair, { isNewRecord: true }).then(function (_repair) {
                context.success(req, res, _repair, {}, RepairSerializer.default);
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
                            if (repair.score && (repair.score != score || shopId != old_shopId)) {
                                context.updateShopScore(context, shopId).then(function () {
                                    if (shopId != old_shopId) {
                                        context.updateShopScore(context, old_shopId).then(function () {
                                            context.success(req, res, _updated_repair, {}, RepairSerializer.default);
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
            Repair.findById(req.params.id, {
                include: [
                    { model: User }
                ]
            }).then(function (_repair) {
                if (_repair) {
                    var owner = _repair.owner;
                    if (req.user.id === owner) {
                        var shopId = _repair.repair_shop;

                        RepairWork.destroy({ where: { for_repair: _repair.id } }).then(function () {
                            Repair.destroy({ where: { id: req.params.id, owner: req.user.id } }).then(function () {
                                context.updateShopScore(context, shopId).then(function () {
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

    saveImage (context, req, res) {
        var file = req.body;
        if (file.repair_id && file.image_id) {
            file.owner = req.user.id;
            RepairImage.create(file, { isNewRecord: true }).then(function (_file) {
                context.success(req, res, _file);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.error(req, res, { message:'INVALID MOEL'}, 400);
        }
    }

    updateImage(context, req, res) {
        var file = req.body;
        if (file.id) {
            RepairImage.findById(file.id, {
                include: [
                    { model: User }
                ]
            }).then(function (_repair_image) {
                if (_repair_image) {
                    var owner = _repair_image.owner;
                    if (req.user.id === owner) {
                        _repair_image.updateAttributes(file).then(function (_updated_repair_image) {
                            context.success(req, res, _updated_repair_image);
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
            context.error(req, res, { message: 'INVALID MOEL' }, 400);
        }
    }

    deleteImage(context, req, res) {
        if (req.params.id) {
            RepairImage.findById(req.params.id, {
                include: [
                    { model: User },
                    { model: File }
                ]
            }).then(function (_repair_image) {
                if (_repair_image) {
                    var owner = _repair_image.owner;
                    var image_id = _repair_image.image_id;
                    var file_url = appRoot + _repair_image.file.url;
                    if (req.user.id === owner) {
                        RepairImage.destroy({ where: { id: req.params.id, owner: req.user.id } }).then(function () {
                            File.destroy({ where: { id: image_id, owner: req.user.id } }).then(function () {
                                console.log('REMOVE FILE====' + file_url);
                                fs.unlinkSync(file_url);
                                context.success(req, res, {});
                            }).catch(function (err) {
                                context.error(req, res, err, 500);
                            });
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
            { url: '/shares', method: 'get', roles: [], response: this.getAll },
            { url: '/repairs', method: 'get', roles: ['admin', 'user'], response: this.getByUser },
            { url: '/repairs', method: 'get', roles: ['admin', 'user'], response: this.getById, params: ['id'] },
            { url: '/repairs', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/repairs', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/repairs', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] },
            { url: '/repairs/image', method: 'post', roles: ['admin', 'user'], response: this.saveImage },
            { url: '/repairs/image', method: 'delete', roles: ['admin', 'user'], response: this.deleteImage, params: ['id'] },
            { url: '/repairs/image', method: 'patch', roles: ['admin', 'user'], response: this.updateImage }
        ];
    }
}

module.exports = new RepairApi();