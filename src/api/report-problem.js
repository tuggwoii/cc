'use strict';
var Setting = require('../database/models').Setting;
var BaseApi = require('./base');
var url = require('url');
var randomstring = require('randomstring');
var captchas = {};
var MailHelper = require('../helpers/email');

class ReportProblemApi extends BaseApi {

    model(data) {
        var model = {
            captcha: data.captcha,
            title: data.title,
            type: data.type,
            email: data.email,
            telephone: data.telephone,
            name: data.name,
            detail: data.detail,
            key: data.key
        };
        return model;
    }

    validate(data) {
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
            else if (!data.detail) {
                reject('DETAIL REQUIRED');
            }
            else if (!captchas[data.key] || (captchas[data.key] && (captchas[data.key] != data.captcha))) {
                reject('INVALID CAPTCHA');
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    report(context, req, res) {
        var model = context.model(req.body);
        context.validate(model).then(function () {
            Setting.all().then(function (_setting) {
                if (_setting && _setting[0].admin_emails) {
                    var emails = _setting[0].admin_emails.split(',');
                    for (var i = 0; i < emails.length; i++) {
                        if (emails[i]) {
                            context.sendMail(emails[i], model).then(function () {
                                console.log('Send report mail success');
                            }).catch(function () {
                                console.log('Send report mail failed');
                            });
                        }
                    }
                }
                context.success(req, res, { message: 'success' });
            });
        }).catch(function (err) {
            context.error(req, res, err, 400);
        });
    }

    sendMail(to, data) {
        var promise = new Promise(function (resolve, reject) {
            var subject = data.title;
            var email_body = '<p>มีการแจ้งปัญหาบน www.carcarenote.com โดยมีรายละเอียดดังนี้: </p>' +
                '<p>ผู้แจ้ง: ' + (data.name ? data.name : 'ไม่ระบุ')  + '</p>' +
                '<p>ประเภทของปัญหา: ' + data.type + '</p>' +
                '<p>อีเมลล์: ' + data.email + '</p>' +
                '<p>เบอร์โทร: ' + (data.telephone ? data.telephone : 'ไม่ระบุ') + '</p>' +
                '<p>รายละเอียด: ' + data.detail + '</p>';
            MailHelper.send(subject, to, email_body, resolve, reject);
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

    endpoints () {
        return [
            { url: '/problems', method: 'post', roles: [], response: this.report },
            { url: '/problems/captcha', method: 'get', roles: [], response: this.captcha }
        ];
    }
}

module.exports = new ReportProblemApi();