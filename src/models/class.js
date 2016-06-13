'use strict';
var fs = require('fs');
var log = require('../helpers/log');
var Base = require('./base');
var date = require('../helpers/date');
var basePath = './src/database/classes';
var modelPath = basePath + '/{id}.json';

class Classes extends Base {

    isExist (path) {
        try {
            var file = fs.lstatSync(path);
            if (file.isFile()) {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    }

    create (data) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            var path = modelPath.replace('{id}', data.name);
            if (!me.isExist(path)) {
                var dateTime = new Date();
                var logDate = date.current();
                data.datetime_created = dateTime;
                data.datetime_updated = dateTime;
                fs.writeFile(path, JSON.stringify(data), function (err) {
                    if (err) reject(err);
                    log.write('class created: ' + logDate);
                    resolve(data);
                });
            }
        });
        return promise;
    }

    get (id) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            var path = modelPath.replace('{id}', id);
            if (me.isExist(path)) {
                fs.readFile(modelPath.replace('{id}', id), 'utf-8', function (err, content) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(JSON.parse(content));
                    }
                });
            }
            else {
                reject(404);
            }
        });
        return promise;
    }

    getAll () {
        var promise = new Promise(function (resolve, reject) {
            var classes = [];
            var isError = false;
            fs.readdir(basePath, function (err, files) {
                if (err) {
                    isError = true;
                    reject(err);
                }
                var fileCount = 0;
                files.forEach(function (file) {
                    fs.readFile(basePath + '/' + file, 'utf-8', function (err, content) {
                        if (err) {
                            isError = true;
                            reject(err);
                        }
                        if (!isError) {
                            fileCount++;
                            classes.push(JSON.parse(content));
                            if (fileCount === files.length) {
                                resolve(classes);
                            }
                        }
                    });
                });
            });
        });
        return promise;
    }

    save (data) {
        var promise = new Promise(function (resolve, reject) {
            if(data) {
                resolve(data);
            }
            else {
                reject();
            }
        });
        return promise;
    }

    isValid (data) {
        if (data.name) {
            return true;
        }
        return false;
    }

    serialize (data) {
        var classes = {
            name: data.name,
            created_by: {
                id: data.created_by.id,
                email: data.created_by.email,
                name: data.created_by.name,
                role: data.created_by.role
            },
            updated_by: {
                id: data.updated_by.id,
                email: data.updated_by.email,
                name: data.updated_by.name,
                role: data.updated_by.role
            },
            datetime_created: data.datetime_created,
            datetime_updated: data.datetime_updated
        };
        return classes;
    }

    serializeList (data) {
        return data;
    }
}

module.exports = new Classes();
