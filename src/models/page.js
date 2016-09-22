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
