'use strict';
var path = require('path');
var File = require('../database/models').File;
var shortid = require('shortid');
var multer = require('multer');
var mime = require('mime');
var BaseApi = require('./base');
var Jimp = require("jimp");
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
        var path = '/files/' + req.file.filename;
        var full_path = appRoot + path;
        var file = {
            url: path,
            size: req.file.size,
            owner: req.user.id,
            is_use: false
        };
        var mb_size = (file.size / (1024 * 1024));
        if (mb_size > 1) {
            Jimp.read(full_path, function (err, image) {
                if (err) {
                    context.error(req, res, err, 500);
                }
                else {
                    image.resize(600, Jimp.AUTO).write(full_path);
                    File.create(file, { isNewRecord: true }).then(function (_file) {
                        context.success(req, res, _file);
                    }).catch(function (err) {
                        context.error(req, res, err, 500);
                    });
                }
            });
        }
        else {
            File.create(file, { isNewRecord: true }).then(function (_file) {
                context.success(req, res, _file);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
    }

    endpoints () {
        return [
			{ url: '/files', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/files', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new FileApi();