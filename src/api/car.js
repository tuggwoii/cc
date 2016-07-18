'use strict';
var Car = require('../database/models').Car;
var CarSerializer = require('../serializers/car-serializer');
var File = require('../database/models').File;
var User = require('../database/models').User;
var Notifications = require('../database/models').Notification;
var Repair = require('../database/models').Repair;
var BaseApi = require('./base');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
//shortid.generate();

class CarApi extends BaseApi {

    getCarByUserId (id) {
        var promise = new Promise(function (resolve, reject) {
            Car.findAll({
                where: { owner: id },
                include: [
                { model: User },
                { model: File },
                { model: Notifications },
                { model: Repair }
                ]
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err)
            });
        });
        return promise;
    }

    getCarById (id) {
        var promise = new Promise(function (resolve, reject) {
            Car.findById(id, {
                include: [
                    { model: User },
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

    validateCreate (req, data) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.brand) {
                reject('BRAND REQUIRED');
            }
            else if (!data.series) {
                reject('SERIES REQUIRED');
            }
            else if (!data.serial) {
                reject('SERIAL REQUIRED');
            }
            else {
                me.getCarByUserId(req.user.id).then(function (res) {
                    if (res.length < req.user.max_car) {
                        resolve();
                    }
                    else {
                        reject('MAX CAR');
                    }
                }).catch(function(err) {
                    reject(err);
                });
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
            else if (!data.brand) {
                reject('BRAND REQUIRED');
            }
            else if (!data.series) {
                reject('SERIES REQUIRED');
            }
            else if (!data.serial) {
                reject('SERIAL REQUIRED');
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    getByUser (context, req, res) {
        context.getCarByUserId(req.user.id).then(function (data) {
            context.success(req, res, data, {}, CarSerializer.default);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    getAll (context, req, res) {
        Car.all({
            include: [
                { model: User },
                { model: File }
            ]
        }).then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    getById (context, req, res) {
        if (req.params.id) {
            context.getCarById(req.params.id).then(function (_car) {
                if (_car) {
                    var owner = _car.dataValues.user.dataValues;
                    if (req.user.id === owner.id) {
                        context.success(req, res, _car, {}, CarSerializer.default);
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

    model (data, owner) {
        var model = {
            name: data.name,
            serial: data.serial,
            brand: data.brand,
            series: data.series,
            image: data.image,
            owner: owner,
            year: data.year,
            date: data.date,
            engine: data.engine,
            color: data.color,
            detail: data.detail
        };
        if (data.id) {
            model.id = data.id;
        }
        if (data.image && data.image.id) {
            model.image = data.image.id;
        }
        return model;
    }

    update (context, req, res) {
        var car = context.model(req.body, req.user.id);
        context.validateUpdate(car).then(function () {
            context.getCarById(car.id).then(function (_car) {
                if (_car) {
                    var db_car = _car.dataValues;
                    var ownerId = db_car.owner;
                    var car_exp = new Date(db_car.exp_date);
                    var curr_date = new Date();
                    if (req.user.id === ownerId) {
                        if (curr_date <= car_exp) {
                            _car.updateAttributes(car).then(function (_updated_car) {
                                context.success(req, res, _updated_car, {}, CarSerializer.default);
                            }).catch(function (err) {
                                context.error(req, res, err, 500);
                            });
                        }
                        else {
                            context.error(req, res, 'CAR EXPIRE', 400);
                        }
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
            Car.findById(req.params.id, {
                include: [
                    { model: User }
                ]
            }).then(function (_car) {
                var owner = _car.dataValues.user.dataValues;
                if (req.user.id === owner.id) {
                    Car.destroy({ where: { id: req.params.id, owner: req.user.id } }).then(function (model) {
                        context.success(req, res, {});
                    }).catch(function (err) {
                        context.error(req, res, err, 500);
                    });
                }
                else {
                    context.denied(res);
                }
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.notfound(res);
        }
    }

    add (context, req, res) {
        var data = context.model(req.body, req.user.id);
        context.validateCreate(req, data).then(function () {
            var exp_date = new Date();
            exp_date.setFullYear(exp_date.getFullYear() + 1);
            data.exp_date = exp_date;
            Car.create(data, { isNewRecord: true }).then(function (model) {
                context.success(req, res, model, {}, CarSerializer.default);
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
            { url: '/admin/cars', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/cars', method: 'get', roles: ['admin', 'user'], response: this.getById, params: ['id'] },
			{ url: '/cars', method: 'get', roles: ['admin', 'user'], response: this.getByUser },
            { url: '/cars', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/cars', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/cars', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new CarApi();