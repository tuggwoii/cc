'use strict';
var fs = require('fs');
var log = require('../helpers/log');
var Base = require('./base');
var date = require('../helpers/date');
var pages;

class Pages extends Base {

    create (page) {
        this.sync();
        pages.push(page);
        return this.save();
    }

    get () {
        if (!pages) {
            this.sync();
        }
        return pages;
    }

    save () {
        var promise = new Promise(function (resolve, reject) {
            var dateTime = date.current();
            var file = './src/database/routes/views.json';
            fs.writeFile(file, JSON.stringify(pages), function (err) {
                if (err) reject(err);
                log.write('pages saved: ' + dateTime);
                resolve();
            });
        });
        return promise;
    }

    sync () {
        pages = JSON.parse(fs.readFileSync('src/database/routes/views.json', 'utf8'));
    }

    serialize (data) {
        var page = {
            url: data.url,
            view: data.view,
            roles: data.roles
        };
        return page;
    }
}

module.exports = new Pages();
