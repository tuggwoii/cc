'use strict';
var Notification = require('../database/models').Notification;
var User = require('../database/models').User;
var Car = require('../database/models').Car;
var Work = require('../database/models').Workgroup;
var Repair = require('../database/models').Repair;
var BaseApi = require('./base');
var url = require('url');
var limits = 10;

class NotificationApi extends BaseApi {

    model (data, user) {
        var model = {
            title: data.title,
            type: data.type,
            mile: data.mile,
            date: data.date,
            detail: data.detail,
            work: data.work,
            for_car: data.car,
            owner: user,
            repair_id: data.repair,
            enable: data.enable,
        };
        if (data.id) {
            model.id = data.id;
            model.repair_id = data.repair_id;
        }
        return model;
    }

    validateCreate (data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.title) {
                reject('TITLE REQUIRED');
            }
            else if (!data.type) {
                reject('TYPE REQUIRED');
            }
            else if (!data.work) {
                reject('WORK REQUIRED');
            }
            else if (!data.for_car) {
                reject('CAR REQUIRED');
            }
            else if (!data.mile && !data.date) {
                reject('MILE/DATE REQUIRED');
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

    validateUpdate (data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data) {
                reject('INVALID DATA');
            }
            else if (!data.title) {
                reject('TITLE REQUIRED');
            }
            else if (!data.type) {
                reject('TYPE REQUIRED');
            }
            else if (!data.work) {
                reject('WORK REQUIRED');
            }
            else if (!data.for_car) {
                reject('CAR REQUIRED');
            }
            else if (!data.mile && !data.date) {
                reject('MILE/DATE REQUIRED');
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

    getNotificationByUserId(queries, limits, skip) {
        var promise = new Promise(function (resolve, reject) {
            var order = [["createdAt", "DESC"]];
            if (queries.type == 1) {
                order = [["date", "ASC"]];
            }
            else if (queries.type == 2) {
                order = [["mile", "ASC"]];
            }
            Notification.findAll({
                where: queries,
                order: order,
                include: [
                    { model: Car },
                    { model: Work },
                    { model: User }
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

    countNotificationByUserId(queries) {
        var promise = new Promise(function (resolve, reject) {
            Notification.count({
                where: queries
            }).then(function (count) {
                resolve(count)
            }).catch(function (err) {
                reject(err)
            });
        });
        return promise;
    }

    getNotificationById (id) {
        var promise = new Promise(function (resolve, reject) {
            Notification.findById(id, {
                include: [
                    { model: Car },
                    { model: Work },
                    { model: User },
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

    getByUser(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var _limits = limits;
        var p = 1;
        var q = {
            owner: req.user.id
        };
        if (queries['p']) {
            p = parseInt(queries['p']);
        }
        if (queries['c']) {
            q.for_car = parseInt(queries['c']);
        }
        if (queries['t']) {
            q.type = parseInt(queries['t']);
            _limits = 5;
        }
        if (queries['limit']) {
            _limits = parseInt(queries['limit']);
        }
        var skip = _limits * (p - 1);

        context.getNotificationByUserId(q, _limits, skip).then(function (data) {
            context.countNotificationByUserId(q).then(function (count) {
                var meta = {
                    count: count,
                    limits: _limits
                };
                context.success(req, res, data, meta);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    getAll (context, req, res) {
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

    getById (context, req, res) {
        if (req.params.id) {
            context.getNotificationById(req.params.id).then(function (_notification) {
                if (_notification) {
                    var owner = _notification.dataValues.user.dataValues;
                    if (req.user.id === owner.id) {
                        context.success(req, res, _notification);
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

    add (context, req, res) {
        var notification = context.model(req.body, req.user.id);
        context.validateCreate(notification).then(function () {
            Notification.create(notification, { isNewRecord: true }).then(function (_notification) {
                context.success(req, res, _notification);
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

    update (context, req, res) {
        var notification = context.model(req.body, req.user.id);
        context.validateUpdate(notification).then(function () {
            context.getNotificationById(notification.id).then(function (_notification) {
                if (_notification) {
                    var owner = _notification.dataValues.user.dataValues;
                    if (req.user.id === owner.id) {
                        _notification.updateAttributes(notification).then(function (_updated_notification) {
                            context.success(req, res, _updated_notification);
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
            Notification.findById(req.params.id, {
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

    endpoints () {
        return [
            { url: '/notifications', method: 'get', roles: ['admin', 'user'], response: this.getByUser },
            { url: '/notifications', method: 'get', roles: ['admin', 'user'], response: this.getById, params: ['id'] },
            { url: '/notifications', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/notifications', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/notifications', method: 'delete', roles: ['admin', 'user'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new NotificationApi();