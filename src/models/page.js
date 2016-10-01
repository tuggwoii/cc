'use strict';
var fs = require('fs');
var log = require('../helpers/log');
var Base = require('./base');
var date = require('../helpers/date');
var pages;

class Pages extends Base {

    create(page) {
        var context = this;
        var promise = new Promise(function (resolve, reject) {
            context.sync();
            page.view = 'static/' + page.name + '.html';
            var path = './src/static/views/' + page.view;
            path = path.replace('{name}', page.name);
            fs.writeFile(path, page.content, function (err) {
                if (err) {
                    reject();
                }
                else {
                    delete page['content'];
                    pages.push(page);
                    context.save().then(function () {
                        resolve(page);
                    }).catch(reject);
                }
            });
        });
        return promise;
    }

    update(page) {
        var context = this;
        var promise = new Promise(function (resolve, reject) {
            context.sync();
            var index = -1;
            for (var i = 0; i < pages.length; i++) {
                if (page.name == pages[i].name) {
                    pages[i] = page;
                    index = i;
                }
            }
            if (pages[index]) {
                if (index > -1 && !pages[index].isSys) {
                    var path = './src/static/views/' + pages[index].view;
                    path = path.replace('{name}', pages[index].name);
                    fs.writeFile(path, pages[index].content, function (err) {
                        if (err) {
                            reject();
                        }
                        else {
                            delete pages[index].content;
                            context.save().then(function () {
                                resolve(pages[index]);
                            }).catch(reject);
                        }
                    });
                }
                else {
                    reject({ message: 'PAGE NOT FOUND' });
                }
            }
            else {
                reject({ message: 'PAGE NOT FOUND' });
            }
        });
        return promise;
    }

    delete (id) {
        var context = this;
        var promise = new Promise(function (resolve, reject) {
            var index = -1;
            var page;
            for (var i = 0; i < pages.length; i++) {
                if (id == pages[i].name) {
                    index = i;
                    page = pages[i];
                }
            }
            if (index > -1 && !page.isSys) {
                var file_url = appRoot + '/src/static/views/' + page.view;
                fs.unlinkSync(file_url);
                pages.splice(index, 1);
                context.save().then(function () {
                    resolve();
                }).catch(reject);
            }
            else {
                reject({ message: 'PAGE NOT FOUND' });
            }
        });
        return promise;
    }

    getAll () {
        var context = this;
        var promise = new Promise(function (resolve, reject) {
            if (!pages) {
                context.sync();
            }
            resolve(pages);
        });
        return promise;
    }

    save () {
        var promise = new Promise(function (resolve, reject) {
            var dateTime = date.current();
            var file = './src/database/routes/views.json';
            fs.writeFile(file, JSON.stringify(pages), function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        return promise;
    }


    sync () {
        pages = JSON.parse(fs.readFileSync('src/database/routes/views.json', 'utf8'));
    }

    isValid(model) {
        return model.name && model.url;
    }

    serialize (data) {
        var page = {
            name: data.name,
            title: data.title,
            url: data.url,
            view: data.view,
            roles: data.roles,
            isSys: data.isSys,
            isMenu: data.isMenu,
            isStatic: data.isStatic
        };
        return page;
    }
}
module.exports = new Pages();
