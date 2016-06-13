'use strict';
var Pages = require('../models/page');

module.exports = function (request, response) {
    var route = request.url;
    var routes = Pages.get();
    var isFound = false;
    for (var i = 0; i < routes.length; i++) {
        if (routes[i].url === route) {
            isFound = true;
            response.status(200).render(routes[i].view);
            break;
        }
    }
    if (!isFound) {
        response.status(404).render('pages/404.html');
    }
};
