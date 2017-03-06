'use strict';
var fs = require('fs');
var sequelize = require('../database/connection');
var Repair = require('../database/models').Repair;
var User = require('../database/models').User;
var Car = require('../database/models').Car;
var Work = require('../database/models').Workgroup;
var Shop = require('../database/models').Shop;
var File = require('../database/models').File;
var Notification = require('../database/models').Notification;
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
            if (data.group) {
                model.group = data.group;
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
                    { model: RepairImage, include: [{ model: File }] },
                    { model: Notification }
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
        var _limit = limits;
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
        if (queries['shop']) {
            q.repair_shop = parseInt(queries['shop']);
        }
        if (queries['limit']) {
            _limit = parseInt(queries['limit']);
        }

        context.getRepairByUserId(req.user.id, q, _limit, skip).then(function (data) {
            context.countRepairByUserId(req.user.id, q).then(function (count) {
                var meta = {
                    count: count,
                    limits: _limit
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

        var CONDITIONS = {
            share: true,
            price: {},
            score: {},
        };

        var SHOP_ASSOSIATIVE = { model: Shop };
        var CAR_ASSOSIATIVE = { model: Car, include: [{ model: File }] };
        var REPAIR_IMAGE_ASSOSIATIVE = { model: RepairImage, include: [{ model: File }] };

        if (queries['work']) {
            CONDITIONS.work = parseInt(queries['work']);
        }
        if (queries['province']) {
            SHOP_ASSOSIATIVE.where = { province: queries['province'] }
        }
        if (queries['lp']) {
            CONDITIONS.price.$gte = parseInt(queries['lp']);
        }
        if (queries['hp']) {
            CONDITIONS.price.$lte = parseInt(queries['hp']);
        }
        if (!CONDITIONS.price.$gte && !CONDITIONS.price.$lte) {
            delete CONDITIONS['price'];
        }
        if (queries['rating']) {
            CONDITIONS.score.$gte = parseInt(queries['rating']);
        }
        if (!CONDITIONS.score.$gte) {
            delete CONDITIONS['score'];
        }
        if (queries['hasimage']) {
            CONDITIONS = {
                $and: [
                        sequelize.where(sequelize.literal('(SELECT COUNT(*) FROM repair_images WHERE repair_images.repairId = repairs.id)'), { $gte: 1 }),
                        CONDITIONS
                ]
            }
        }
        if (queries['months'] && queries['year']) {
            CAR_ASSOSIATIVE.where = {
                $or: []
            }
            var _months = queries['months'].split(',');
            for (var i = 0; i < _months.length; i++) {
                var fdate = new Date(parseInt(queries['year']) - 543, parseInt(_months[i]), 1);
                var bdate = new Date(parseInt(queries['year']) - 543, parseInt(_months[i]) + 1, 1)
                CAR_ASSOSIATIVE.where.$or.push({
                    $and: [
                        {
                            exp_date: {
                                $gte: fdate
                            }
                        },
                         {
                             exp_date: {
                                 $lte: bdate
                             }
                         }
                    ]
                });
            }
        }
        if (queries['q']) {
            var AND_CONDITION = CONDITIONS;
            CONDITIONS = {};
            CONDITIONS.$and = [
                AND_CONDITION,
                {
                    $or: [
                       { title: { like: '%' + queries['q'] + '%' } },
                       sequelize.where(sequelize.literal('(SELECT brand FROM cars WHERE repairs.carId = cars.id)'), { like: '%' + queries['q'] + '%' }),
                       sequelize.where(sequelize.literal('(SELECT serial FROM cars WHERE repairs.carId = cars.id)'), { like: '%' + queries['q'] + '%' })
                    ]
                }
            ]
        }

        var order_by = [["createdAt", "DESC"]];
        if (queries['sort_column']) {
            order_by = [[queries['sort_column'], queries['sort_order']]];
        }

        Repair.all({
            where: CONDITIONS,
            order: order_by,
            include: [
                CAR_ASSOSIATIVE,
                { model: Work },
                { model: User, include: [{ model: File }] },
                { model: RepairWork },
                SHOP_ASSOSIATIVE,
                REPAIR_IMAGE_ASSOSIATIVE
            ],
            offset: skip,
            limit: items
        }).then(function (data) {
            Repair.count({ where: CONDITIONS, include: [CAR_ASSOSIATIVE, SHOP_ASSOSIATIVE] }).then(function (count) {
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

    getAllByShop(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var items = 20;
        var p = 1;
        if (queries['p']) {
            p = parseInt(queries['p']);
        }
        if (queries['limit']) {
            items = parseInt(queries['limit']);
        }
        var skip = items * (p - 1);


        var CONDITIONS = {
            share: true
        };
        if (queries['shop']) {
            CONDITIONS.repair_shop = parseInt(queries['shop']);
        }
        var order_by = [["createdAt", "DESC"]];
        if (queries['sort_column']) {
            order_by = [[queries['sort_column'], queries['sort_order']]];
        }

        Repair.all({
            where: CONDITIONS,
            order: order_by,
            include: [
                { model: Car}
            ],
            offset: skip,
            limit: items
        }).then(function (data) {
            Repair.count({ where: CONDITIONS}).then(function (count) {
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
                    if (req.user.id === owner || req.user.role.id === 1) {
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

    updateShopScoreAndService(context, shopId, service) {
        var promise = new Promise(function (resolve, reject) {
            context.getShopById(shopId).then(function (_shop) {
                if (_shop) {
                    var shop_str = JSON.stringify(_shop);
                    var shop = JSON.parse(shop_str);
                    var repairs = shop.repairs;
                    shop.rating = context.calculateShopScore(repairs);
                    if (service) {
                        if (!_shop.services || _shop.services.indexOf(service) == -1) {
                            shop.services = shop.services + ',' + service
                        }
                    }
                    _shop.updateAttributes(shop).then(function () {
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

    getIP(req) {
        var ip = req.headers['x-forwarded-for'];
        if (!ip) {
            if (req.connection && req.connection.remoteAddress) {
                ip = req.connection.remoteAddress;
            }
            else if (req.socket && req.socket.remoteAddress) {
                ip = req.socket.remoteAddress;
            }
            else if (req.connection && req.connection.socket && req.connection.socket.remoteAddress) {
                ip = req.connection.socket.remoteAddress;
            }
        }
        if (!ip) {
            ip = 'UNKNOW';
        }
        return ip;
    }

    add(context, req, res) {
        var repair = context.model(req.body, req.user.id);
        var shopId = repair.repair_shop;
        var ip = context.getIP(req);
        context.validateCreate(repair).then(function () {
            repair.ip = ip;
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
        var ip = context.getIP(req);
        context.validateUpdate(repair).then(function () {
            context.getRepairById(repair.id).then(function (_repair) {
                if (_repair) {
                    var owner = _repair.owner;
                    var score = _repair.score;
                    var old_shopId = _repair.repair_shop;
                    if (req.user.id === owner) {
                        repair.ip = ip;
                        _repair.updateAttributes(repair).then(function (_updated_repair) {
                            if (shopId) {
                                context.updateShopScoreAndService(context, shopId, repair.group).then(function () {
                                    if (old_shopId && shopId != old_shopId) {
                                        context.updateShopScoreAndService(context, old_shopId).then(function () {
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
                    if (req.user.id === owner || req.user.role.id === 1) {
                        var shopId = _repair.repair_shop;
                        RepairWork.destroy({ where: { for_repair: _repair.id } }).then(function () {
                            Repair.destroy({ where: { id: req.params.id, owner: owner } }).then(function () {
                                context.updateShopScoreAndService(context, shopId).then(function () {
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
                    
                    if (req.user.id === owner || req.user.role.id === 1) {
                        RepairImage.destroy({ where: { id: req.params.id, owner: owner } }).then(function () {
                            File.destroy({ where: { id: image_id, owner: req.user.id } }).then(function () {
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

    getPreviousShop(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var conditions = {
            owner: req.user.id
        };
        if (queries.car) {
            conditions.for_car = queries.car;
        }

        Repair.all({
            where: conditions,
            include: [
                { model: Shop }
            ]
        }).then(function (data) {
            context.success(req, res, { repairs: data }, {}, RepairSerializer.shops);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    viewCount(context, req, res) {
        if (req.params.id) {
            Repair.findById(req.params.id, {
                include: [
                    { model: User }
                ]
            }).then(function (_repair) {
                var attr = {
                    view_count: _repair.view_count
                };
                if (attr.view_count) {
                    attr.view_count = attr.view_count + 1;
                }
                else {
                    attr.view_count = 1;
                }
                _repair.updateAttributes(attr).then(function (_updated_repair) {
                    context.success(req, res, { success: 'success' });
                }).catch(function (err) {
                    context.error(req, res, err, 500);
                });
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
            { url: '/repairs/shop', method: 'get', roles: [], response: this.getAllByShop },
            { url: '/repairs', method: 'get', roles: ['admin', 'user'], response: this.getByUser },
            { url: '/repairs', method: 'get', roles: ['admin', 'user'], response: this.getById, params: ['id'] },
            { url: '/repairs', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/repairs', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/repairs', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] },
            { url: '/repairs/image', method: 'post', roles: ['admin', 'user'], response: this.saveImage },
            { url: '/repairs/image', method: 'delete', roles: ['admin', 'user'], response: this.deleteImage, params: ['id'] },
            { url: '/repairs/image', method: 'patch', roles: ['admin', 'user'], response: this.updateImage },
            { url: '/repair/shops', method: 'get', roles: ['admin', 'user'], response: this.getPreviousShop },
            { url: '/repairs/view', method: 'patch', roles: [], response: this.viewCount, params: ['id'] }
        ];
    }
}

module.exports = new RepairApi();