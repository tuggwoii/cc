'use strict';
var File = require('../database/models').File;
var shortid = require('shortid');
var multer = require('multer');
var mime = require('mime');
var BaseApi = require('./base');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

class FileApi extends BaseApi {

    validate (data) {
        var promise = new Promise(function (resolve, reject) {
            if (!data || !data.name) {
                reject('INVALID DATA');
            }
            else {
                resolve();
            }
        })
        return promise;
    }

    getAll (context, req, res) {
        File.all().then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    model (data) {
        return {
            url: data.url
        }
    }

    delete (context, req, res) {
        if (req.params.id) {
            File.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
    }

    add (context, req, res) {
        var data = context.model(req.body);
        context.validate(data).then(function () {
            Role.create(data, { isNewRecord: true }).then(function (model) {
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

    config () {
        return multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './files/')
            },
            filename: function (req, file, cb) {
                cb(null, shortid.generate() + '.' + mime.extension(file.mimetype));
            }
        });
    }

    upload (context, req, res) {
        console.log(req.file);
        var file = {
            url: '/files/' + req.file.filename,
            size: req.file.size,
            owner: req.user.id,
            is_use: false
        };
        File.create(file, { isNewRecord: true }).then(function (_file) {
            context.success(req, res, _file);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    endpoints () {
        return [
			{ url: '/files', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/files', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new FileApi();