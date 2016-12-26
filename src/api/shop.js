'use strict';
var sequelize = require('../database/connection');
var Shop = require('../database/models').Shop;
var User = require('../database/models').User;
var Image = require('../database/models').File;
var Repair = require('../database/models').Repair;
var Serializer = require('../serializers/shop-serializer');
var BaseApi = require('./base');
var url = require('url');
var limits = 24;

class ShopApi extends BaseApi {

    model(data, user) {
        var model = {
            name: data.name,
            owner_name: data.owner_name,
            create_by: user,
            update_by: user,
            address: data.address,
            city: data.city,
            province: data.province,
            lat: data.lat,
            lon: data.lon,
            map: data.map,
            services: data.services,
            website: data.website
        };
        if (data.image) {
            model.image = data.image.id
        }
        if (data.id) {
            model.id = data.id;
            if (model.create_by) {
                delete model['create_by'];
            }
        }
        return model;
    }

    validateCreate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.name) {
                reject('NAME REQUIRED');
            }
            else if (!data.province) {
                reject('PROVINCE REQUIRED');
            }
            else {
                resolve();
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
            else if (!data.name) {
                reject('NAME REQUIRED');
            }
            else if (!data.province) {
                reject('PROVINCE REQUIRED');
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    getNotificationByUserId(id, carId, limits, skip) {
        var promise = new Promise(function (resolve, reject) {
            var conditions = {
                owner: id
            };
            if (carId) {
                conditions['for_car'] = carId;
            }
            Shop.findAll({
                where: conditions,
                order: [["createdAt", "DESC"]],
                include: [
                    { model: create_by },
                    { model: update_by },
                    { model: image }
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

    countNotificationByUserId(id, carId) {
        var promise = new Promise(function (resolve, reject) {
            var conditions = {
                owner: id
            };
            if (carId) {
                conditions['for_car'] = carId;
            }
            Shop.count({ where: conditions }).then(function (count) {
                resolve(count)
            }).catch(function (err) {
                reject(err)
            });
        });
        return promise;
    }

    getShopById(id) {
        var promise = new Promise(function (resolve, reject) {
            Shop.findById(id, {
                include: [
                    { model: User, as: 'create_user', include: [{ model: Image }] },
                    { model: User, as: 'update_user', include: [{ model: Image }] },
                    { model: Image }
                ]
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    countShop(queries) {
        var promise = new Promise(function (resolve, reject) {
            Shop.count({
                where: queries
            }).then(function (count) {
                resolve(count)
            }).catch(function (err) {
                reject(err)
            });
        });
        return promise;
    }

    getAll(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var conditions = {};
        var user_limits = limits;
        var p = 1;
        
        if (queries['q']) {
            conditions.name = { like: '%' + queries['q'] + '%'};
        }
        if (queries['limits']) {
            user_limits = parseInt(queries['limits']);
        }
        if (queries['p']) {
            p = parseInt(queries['p']);
        }
        if (queries['s']) {
            conditions.services = { like: '%' + queries['s'] + '%' };
        }
        if (queries['c']) {
            conditions.province = queries['c'];
        }
        if (queries['using_count']) {
            conditions = {
                $and: [
                    sequelize.where(sequelize.literal('(SELECT COUNT(*) FROM repairs WHERE repairs.shopId = shops.id)'), { $gte: queries['using_count'] }),
                    conditions
                ]
            };
        }
        var skip = user_limits * (p - 1);

        Shop.all({
            
            attributes: [
                'id',
                'name',
                'rating',
                'image',
                'create_by',
                'update_by',
                'province',
                [sequelize.literal('(SELECT COUNT(*) FROM repairs WHERE repairs.shopId = shops.id)'), 'RepairCount']
            ],
            where: conditions,
            order: [["rating", "DESC"], [sequelize.literal('RepairCount'), 'DESC']],
            include: [
                { model: User, as: 'create_user', include: [{ model: Image } ] },
                { model: User, as: 'update_user', include: [{ model: Image }] },
                { model: Image },
                { model: Repair }
            ],
            offset: skip,
            limit: user_limits
        }).then(function (data) {
            context.countShop(conditions).then(function (count) {
                var meta = {
                    count: count,
                    limits: user_limits
                };
                context.success(req, res, data, meta, Serializer.default);
            }).catch(function () {
                context.error(req, res, err, 500);
            })
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    getById(context, req, res) {
        if (req.params.id) {
            context.getShopById(req.params.id).then(function (_shop) {
                if (_shop) {
                    context.success(req, res, _shop);
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
        var shop = context.model(req.body, req.user.id);
        context.validateCreate(shop).then(function () {
            Shop.create(shop, { isNewRecord: true }).then(function (_shop) {
                context.success(req, res, _shop);
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
        var shop = context.model(req.body, req.user.id);
        context.validateUpdate(shop).then(function () {
            context.getShopById(shop.id).then(function (_shop) {
                if (_shop) {
                    /*
                    if (_shop.create_by == req.user.id) {
                       
                    }
                    else {
                        context.denied(res);
                    }*/
                    _shop.updateAttributes(shop).then(function (_updated_shop) {
                        context.success(req, res, _updated_shop);
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
            Shop.findById(req.params.id, {
                include: [
                    { model: User }
                ]
            }).then(function (_notification) {
                if (_notification) {
                    var owner = _notification.dataValues.user.dataValues;
                    if (req.user.id === owner.id) {
                        Notification.destroy({ where: { id: req.params.id, owner: req.user.id } }).then(function () {
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
            { url: '/shops', method: 'get', roles: [], response: this.getAll },
            { url: '/shops', method: 'get', roles: [], response: this.getById, params: ['id'] },
            { url: '/shops', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/shops', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/shops', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new ShopApi();