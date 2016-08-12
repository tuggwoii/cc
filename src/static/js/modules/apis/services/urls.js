'use strict';
module.factory('URLS', function () {
    var base = '/api/v1/';
    var models = ['cars', 'files', 'workgroup', 'notifications', 'repairs', 'shops', 'works', 'shares'];
    var endpoints = {
        accounts: {
            login: base + 'accounts/login',
            register: base + 'accounts',
            me: base + 'accounts/me',
            logout: base + 'accounts/logout',
            update: base + 'accounts'
        },
        strings: '/resources/strings.json'
    };

    function modelEndpoints (model) {
        return {
            all: base + model,
            one: base + model + '/{id}',
            image: base + model + '/image',
            image_id: base + model + '/image/{id}'
        };
    }

    return {
        model: function (model) {
            if (models.indexOf(model) > -1) {
                return modelEndpoints(model);
            }
            else {
                return endpoints[model];
            }
        }
    };
});
