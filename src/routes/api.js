'use strict';
var authorize = require('../authorize/auth');
var staticApi = require('../api/static');
var roleApi = require('../api/role');
var accountApi = require('../api/account');
var pageApi = require('../api/page');
var routes = [staticApi, roleApi, accountApi, pageApi];

module.exports = function (request, response) {
    var isFound = false;
    for (var i = 0; i < routes.length; i++) {
        var context = routes[i];
        var endpoints = context.endpoints();
        for (var j = 0; j < endpoints.length; j++) {
            var requestUrl = request.url;
            var requestPaths = requestUrl.split('/');
            var route = endpoints[j];
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
                    request.params = paramsObject;
                }
                else {
                    paramsValid = false;
                }
            }
            else {
                request.params = {};
            }
            if (route.url === requestUrl && route.method === request.method.toLowerCase() && paramsValid) {
                isFound = true;
                if (route.roles.length) {
                    if (authorize.isAuthorize(request, route.roles)) {
                        route.response(context, request, response);
                    }
                    else {
                        response.status(401).json({
                            data: [],
                            error: {
                                message: 'PERMISSION DENIED'
                            },
                            meta: []
                        });
                    }
                }
                else {
                    route.response(context, request, response);
                }
            }
            if (isFound) {
                break;
            }
        }
        if (isFound) {
            break;
        }
    }
    if (!isFound) {
        response.status(404).json({
            data: [],
            error: {
                message: 'NOT FOUND'
            },
            meta: []
        });
    }
};

