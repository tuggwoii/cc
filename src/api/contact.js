'use strict';
var BaseApi = require('./base');
var Contact = require('../database/models').Contact;
var User = require('../database/models').User;
var MailHelper = require('../helpers/email');
var url = require('url');

class ContactApi extends BaseApi {

    validate(data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data || !data.type || !data.price || !data.datetime) {
                reject('INVALID DATA');
            }
            else {
                if (data.type == 1 && !data.car_ids) {
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
            status: 0
        };
        return model;
    }

    modelUpdate(data, user) {
        var model = {
            id: data.id,
            detail: data.detail,
            type: data.type,
            send_by: user.id,
            car_idsl: data.car,
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
        var conditions = { };

        if (queries['status']) {
            conditions.status = queries['status'];
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
                        if (data.send_by == req.user.id) {
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


    add(context, req, res) {
        var data = context.model(req.body, req.user);
        context.validate(data).then(function () {
            Contact.create(data, { isNewRecord: true }).then(function (model) {
                context.sendEmail(req.user.email, model['null']);
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

    update(context, req, res) {
        var data = context.modelUpdate(req.body, req.user);
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

    endpoints() {
        return [
			{ url: '/contacts', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/contacts', method: 'get', roles: ['admin', 'user'], response: this.get, params: ['id'] },
            { url: '/contacts', method: 'post', roles: ['admin', 'user'], response: this.add },
            { url: '/contacts', method: 'patch', roles: ['admin'], response: this.update },
            { url: '/contacts', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new ContactApi();