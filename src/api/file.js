'use strict';
var fs = require("fs");
var path = require('path');
var File = require('../database/models').File;
var Car = require('../database/models').Car;
var User = require('../database/models').User;
var Repair = require('../database/models').Repair;
var Report = require('../database/models').Report;
var Shop = require('../database/models').Shop;
var RepairImage = require('../database/models').RepairImage;
var CarSerializer = require('../serializers/car-serializer');
var shortid = require('shortid');
var multer = require('multer');
var mime = require('mime');
var BaseApi = require('./base');
var Jimp = require("jimp");
var url = require('url');
var limits = 100;
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

class FileApi extends BaseApi {

    validate(data) {
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

    getAll(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var p = 1;
        if (queries['p']) {
            p = parseInt(queries['p']);
        }
        var _limit = limits;
        var skip = _limit * (p - 1);
        var conditions = {
            is_delete: false
        };

        var modelsInclude = [
            { model: User }
        ];

        var conditions = {
            $and: []
        };

        if (queries['type']) {
            conditions.$and.push({ type: queries['type'] });

            if (queries['type'] == '2') {
                modelsInclude.push({ model: Car });
            }

            if (queries['type'] == '3') {
                modelsInclude.push({ model: Shop });
            }

            if (queries['type'] == '4') {
                modelsInclude.push({ model: RepairImage });
            }
        }

        if (queries['q']) {
            var _or = {
                url: { like: '%' + queries['q'] + '%' }
            };
            conditions.$and.push({ $or: _or });
        }

        if (queries['months'] && queries['year']) {
            var _or = [];
            var _months = queries['months'].split(',');
            for (var i = 0; i < _months.length; i++) {
                var fdate = new Date(parseInt(queries['year']) - 543, parseInt(_months[i]), 1);
                var bdate = new Date(parseInt(queries['year']) - 543, parseInt(_months[i]) + 1, 1)

                _or.push({
                    $and: [
                        {
                            createdAt: {
                                $gte: fdate
                            }
                        },
                        {
                            createdAt: {
                                $lte: bdate
                            }
                        }
                    ]
                });
            }
            conditions.$and.push({ $or: _or });
        }
        else if (queries['year']) {
            var _or = [];
            var fdate = new Date(parseInt(queries['year']) - 543, 0, 1);
            var bdate = new Date(parseInt(queries['year']) - 543, 11, 1);
            _or.push({
                $and: [
                    {
                        createdAt: {
                            $gte: fdate
                        }
                    },
                    {
                        createdAt: {
                            $lte: bdate
                        }
                    }
                ]
            });
            conditions.$and.push({ $or: _or });
        }

        var order = [["createdAt", "DESC"]];
        if (queries['sort'] == '1') {
            order = [["createdAt", "ASC"]];
        }

        File.all({
            where: conditions,
            offset: skip,
            limit: _limit,
            include: modelsInclude,
            order: order
        }).then(function (data) {
            File.count({
                where: conditions
            }).then(function (count) {
                var meta = {
                    count: count,
                    limits: _limit
                };
                context.success(req, res, data, meta);
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    model(data) {
        return {
            url: data.url
        }
    }

    findRelationInFile(id) {
        var promise = new Promise(function (resolve, reject) {
            var successCount = 0;

            function increaseAndCheckDone() {
                successCount++;
                if (successCount == 5) {
                    resolve();
                }
            }

            function removeImageForEachModel(model, condition, prop, is_delete) {
                if (is_delete) {
                    model.destroy({
                        where: condition,
                    }).then(function (data) {
                        Report.destroy({ where: { file_id: condition.image_id } }).then(function (data) {
                            increaseAndCheckDone();
                        }).catch(function (err) {
                            increaseAndCheckDone();
                        });
                    }).catch(function (err) {
                        increaseAndCheckDone();
                    });
                }
                else {
                    model.all({
                        where: condition,
                        include: [
                            { model: File }
                        ]
                    }).then(function (data) {
                        if (data.length) {
                            var _data = data[0];
                            _data[prop] = null;
                            _data.save([prop]).then(function (_new) {
                                increaseAndCheckDone();
                            });
                        }
                        else {
                            increaseAndCheckDone();
                        }
                    }).catch(function (err) {
                        increaseAndCheckDone();
                    });
                }
            }

            removeImageForEachModel(Report, { file_id: id }, 'file_id');
            removeImageForEachModel(User, { image: id }, 'image');
            removeImageForEachModel(Car, { image: id }, 'image');
            removeImageForEachModel(Shop, { image: id }, 'image');
            removeImageForEachModel(RepairImage, { image_id: id }, 'image_id', true);
        });
        return promise;
    }

    delete(context, req, res) {
        if (req.params.id) {
            File.findById(req.params.id).then(function (_file) {
                if (_file) {
                    var fileUrl = _file.url;
                    context.findRelationInFile(req.params.id).then(function () {
                        File.destroy({ where: { id: req.params.id } }).then(function (model) {
                            var file_url = appRoot + fileUrl;
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
                    context.notfound(res);
                }
            });
        }
    }

    config() {
        return multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './files/')
            },
            filename: function (req, file, cb) {
                cb(null, shortid.generate() + '.' + mime.extension(file.mimetype));
            }
        });
    }

    upload(context, req, res) {

        //car 
        var params = url.parse(req.url, true);
        var queries = params.query;

        if (queries.car && queries.type) {
            context.getCarById(queries.car).then(function (_car) {
                if (_car) {
                    var car = CarSerializer.default(_car);
                    if (car.file_usage < car.max_file_size) {
                        context.uploading(context, req, res);
                    }
                    else {
                        context.error(req, res, 'MAX_FILE', 400);
                    }
                }
                else {
                    context.error(req, res, 'CAR_NOT_FOUND', 404);
                }
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else if (queries.type) {
            context.uploading(context, req, res);
        }
        else {
            context.error(req, res, 'TYPE_REQUIRE', 400);
        }
    }

    uploading(context, req, res) {
        var params = url.parse(req.url, true);
        var queries = params.query;
        var path = '/files/' + req.file.filename;
        var full_path = appRoot + path;

        var file = {
            url: path,
            size: req.file.size,
            owner: req.user.id,
            is_use: true,
            is_delete: false,
            type: queries.type
        };

        var mb_size = (file.size / (1024 * 1024));
        if (mb_size > 1) {
            Jimp.read(full_path, function (err, image) {
                if (err) {
                    context.error(req, res, err, 500);
                }
                else {
                    image.resize(600, Jimp.AUTO).write(full_path, function () {
                        var stats = fs.statSync(full_path);
                        var fileSizeInBytes = stats["size"];

                        if (fileSizeInBytes > 0) {
                            file.size = fileSizeInBytes;
                        }

                        context.createFile(context, req, res, file);
                    });
                }
            });
        }
        else {
            context.createFile(context, req, res, file);
        }
    }

    createFile(context, req, res, file) {
        File.create(file, { isNewRecord: true }).then(function (_file) {
            context.success(req, res, _file);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    getCarById(id) {
        var promise = new Promise(function (resolve, reject) {
            Car.findById(id, {
                include: [
                    { model: User },
                    { model: File },
                    {
                        model: Repair,
                        include: [
                            {
                                model: RepairImage,
                                include: [
                                    { model: File }
                                ]
                            }
                        ]
                    }
                ]
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
        return promise;
    }

    endpoints() {
        return [
            { url: '/files', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/files', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new FileApi();