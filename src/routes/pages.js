'use strict';
var Pages = require('../models/page');
var Share = require('../models/share');
var authorize = require('../authorize/auth');
var fs = require('fs');

module.exports = function (req, res) {
    Pages.getAll().then(function (pages) {
        var routes = pages;
        var isFound = false;
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var requestUrl = decodeURIComponent(req.url);
            requestUrl = (req.url.split('?')[0]).replace(/\/$/, "");
            var requestPaths = requestUrl.split('/');
            var paramsValid = true;
            if (route.params && route.params.length) {
                var routePaths = route.url.split('/');
                if (requestPaths.length === (routePaths.length + route.params.length)) {
                    var params = requestPaths.splice(requestPaths.length - 1, route.params.length);
                    var urls = requestPaths;
                    requestUrl = urls.join('/');
                    var paramsObject = {};
                    for (var p = 0; p < params.length; p++) {
                        paramsObject[route.params[p]] = params[p];
                    }
                    req.params = paramsObject;
                }
                else {
                    paramsValid = false;
                }
            }
            if (paramsValid) {
                var permission = true;
                if (decodeURIComponent(requestUrl.toLowerCase()) === route.url.toLowerCase()) {
                    if (route.roles && route.roles.length) {
                        if (!authorize.isPageAuthorize(req, route.roles)) {
                            permission = false;
                        }
                    }
                    if (permission) {
                        isFound = true;
                        if (route.model && route.model === 'share') {
                            Share.response(Share, req, res, route);
                        }
                        else if (route.isStatic) {
                            var path = './src/static/views/' + route.view;
                            route.content = fs.readFileSync(path, 'utf8');
                            res.status(200).render('static/master.html', route);
                        }
                        else {
                            res.status(200).render(route.view);
                        }
                        break;
                    }
                }
            }
            else {
                isFound = false;
            }
        }
        if (!isFound) {
            res.status(404).render('pages/404.html');
        }
    }).catch(function () {
        res.status(500).render('pages/500.html');
    });
};
