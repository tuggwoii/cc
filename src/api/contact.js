'use strict';
var BaseApi = require('./base');
var Contact = require('../database/models').Contact;
var User = require('../database/models').User;
var Car = require('../database/models').Car;
var Setting = require('../database/models').Setting;
var MailHelper = require('../helpers/email');
var DateHelper = require('../helpers/date');
var url = require('url');
var randomstring = require('randomstring');
var captchas = {};

class ContactApi extends BaseApi {

    validate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data || !data.type || !data.price || !data.datetime) {
                reject('INVALID DATA');
            }
            else if (!captchas[data.key] || (captchas[data.key] && (captchas[data.key] != data.captcha))) {
                reject('INVALID CAPTCHA');
            }
            else {
                if (data.type == 1 && !data.car) {
                    reject('INVALID CAR');
                }
                else {
                    resolve();
                }
            }
        })
        return promise;
    }

    validateUpdate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data || !data.id || !data.type || !data.datetime) {
                reject('INVALID DATA');
            }
            else {
                resolve();
            }
        })
        return promise;
    }

    model(data, user) {
        var model = {
            detail: data.detail,
            type: data.type,
            send_by: user.id,
            car_ids: data.car,
            datetime: data.datetime,
            price: data.price,
            telephone: data.telephone,
            status: 0
        };
        return model;
    }

    modelUpdate(data) {
        var model = {
            id: data.id,
            detail: data.detail,
            type: data.type,
            car_ids: data.car,
            datetime: data.datetime,
            status: data.status,
            price: data.price
        };
        return model;
    }

    getById(id) {
        var promise = new Promise(function (resolve, reject) {
            Contact.findById(id, {
                include: [
                    { model: User }
                ]
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    getAll(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var conditions = {
            $and: []
        };

        if (queries['status']) {
            var _or = [];
            var statuses = queries['status'].split(',');
            for (var i = 0; i < statuses.length; i++) {
                _or.push({ status: statuses[i]});
            }
            conditions.$and.push({ $or: _or });
        }

        if (queries['month']) {
            var lastDaye = DateHelper.getDayNumOfMonth(queries['month'], queries['year']);
            conditions.$and.push({
                createdAt: {
                    $lte: new Date(queries['year'], parseInt(queries['month']) - 1, lastDaye),
                    $gte: new Date(queries['year'], parseInt(queries['month']) - 1, 1)
                }
            })
        }
        else {
            conditions.$and.push({
                createdAt: {
                    $lte: new Date(queries['year'], 11, 31),
                    $gte: new Date(queries['year'], 0, 1)
                }
            })
        }

        Contact.all({
            where: conditions,
            order: [["createdAt", "DESC"]],
            include: [
                { model: User }
            ]
        }).then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    get(context, req, res) {
        if (req.params.id) {
            if (!isNaN(parseInt(req.params.id))) {
                context.getById(req.params.id).then(function (data) {
                    if (data) {
                        if (data.send_by == req.user.id || req.user.role.id == 1) {
                            context.success(req, res, data);
                        }
                        else {
                            context.notfound(res);
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
        else {
            context.notfound(res);
        }
    }

    autoExpandCarExpire(ids) {
        var total = ids.length;
        var current = 0;
        var promise = new Promise(function (resolve, reject) {
            if (total == 0) {
                resolve();
            }
            Setting.all().then(function (_setting) {

                var setting = { y: _setting[0].exp_year, m: _setting[0].exp_month };

                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    if (id) {
                        Car.findById(id).then(function (_c) {
                            var date = new Date();
                            var carExpDate = new Date(_c.exp_date);
                            if (carExpDate > date) {
                                date = carExpDate;
                            }
                            date.setMonth(date.getMonth() + setting.m)
                            date.setFullYear(date.getFullYear() + setting.y);
                            var update = { exp_date: date };
                            _c.updateAttributes(update).then(function () {
                                current++;
                                if (current == total) {
                                    resolve();
                                }
                            });
                        }).catch(function () {
                            current++;
                            if (current == total) {
                                resolve();
                            }
                        });
                    }
                    else {
                        current++;
                        if (current == total) {
                            resolve();
                        }
                    }
                }
            });
        });
        return promise;
    }

    add(context, req, res) {
        context.validate(req.body).then(function () {
            var data = context.model(req.body, req.user);
            Contact.create(data, { isNewRecord: true }).then(function (model) {

                //user email
                context.sendEmail(req.user.email, model['null']);

                //admin email
                Setting.all().then(function (_setting) {
                    if (_setting[0].admin_emails) {
                        var emails = _setting[0].admin_emails.split(',');
                        for (var i = 0; i < emails.length; i++){
                            if (emails[i]) {
                                context.sendAdminEmail(emails[i], req.user.name, model);
                            }
                        }
                    }
                });

                if (data.type == 1) {
                    var ids = model.car_ids.split(',');
                    context.autoExpandCarExpire(ids).then(function () {
                        context.success(req, res, model);
                    });
                }
                else if (data.type == 2) {
                    User.findById(req.user.id).then(function (_u) {
                        var update = { max_car: _u.max_car += 1 };
                        _u.updateAttributes(update).then(function () {
                            context.success(req, res, model);
                        });
                    }).catch(function () {
                        context.error(req, res, err, 500);
                    });
                }
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
        var data = context.modelUpdate(req.body);
        context.validateUpdate(data).then(function () {
            context.getById(data.id).then(function (_contact) {
                if (_contact) {
                    _contact.updateAttributes(data).then(function (newData) {
                        context.success(req, res, newData);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    context.notfound(res);
                }
            }).catch(function (err) {
                context.error(req, res, err, 400);
            });
        }).catch(function (err) {
            context.error(req, res, err, 400);
        });
    }

    delete (context, req, res) {
        if (req.params.id) {
            Contact.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.notfound(res);
        }
    }

    sendEmail(email_to, id) {
        var promise = new Promise(function (resolve, reject) {
            var subject = 'Payment Received';
            var email_body = '<p>ท่านได้รับอีเมลล์ฉบับนี้เนื่องจากท่านได้ทำการแจ้งโอนเงินบน www.carcarenote.com</p>' +
              '<p>ท่าสามาถติดตามการดำเนินการได้โดยการคลิ๊กลิงค์ ' +
              '<a href="www.carcarenote.com/payment?id=' + id +
              '">www.carcarenote.com/payment?id=' + id + '</a></p>' +
              '<p>ทางเราได้รับการแจ้งโอนเรียร้อยแล้ว กรุณาเก็บอีเมลล์ฉบับนี้ไว้หรือ Book mark ลิงค์ไว้เพื่อติดตามการดำเนินการ</p>' +
              '<p>ขอบคุณที่ใช้บริการ www.carcarenote.com</p>';
            MailHelper.send(subject, email_to, email_body, resolve, reject);
        });
        return promise;
    }

    sendAdminEmail(email_to, user, data) {
        var promise = new Promise(function (resolve, reject) {
            var date = new Date();
            var date_str = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + '') + ':' +
                (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + '') + ' ' +
                (date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '') + '-' +
                (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth() + '') + '-' +
                (date.getFullYear() + '')

            var subject = 'Payment Received';
            var email_body = '<p>มีการแจ้งโอนเงินบน www.carcarenote.com โดยมีรายละเอียดดังนี้: </p>' +
                '<p>โอนมาจาก: ' + user + '</p>' +
                '<p>จำนวน: ' + (data.price ? data.price : 0) + ' บาท</p>' +
                '<p>เพื่อทำการ: ' + (data.type == 1 ? 'ต่ออายุรถ' : 'เพิ่มจำนวนรถ') + '</p>' +
                '<p>เมื่อเวลา: ' + date_str + '</p>' +
                '<p>Link: <a href="www.carcarenote.com/admin#!/edit-payment?id=' + data['null'] +
                '">www.carcarenote.com/admin#!/edit-payment?id=' + data['null'] + '</a></p>';
            MailHelper.send(subject, email_to, email_body, resolve, reject);
        });
        return promise;
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
            { url: '/contacts/captcha', method: 'get', roles: [], response: this.captcha },
			{ url: '/contacts', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/contacts', method: 'get', roles: ['admin', 'user'], response: this.get, params: ['id'] },
            { url: '/contacts', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/contacts', method: 'patch', roles: ['admin'], response: this.update },
            { url: '/contacts', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new ContactApi();