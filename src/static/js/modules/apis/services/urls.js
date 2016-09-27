'use strict';
module.factory('URLS', function () {
    var base = '/api/v1/';
    var models = ['cars', 'files', 'workgroup', 'notifications', 'repairs', 'shops', 'works', 'shares', 'pages'];
    var endpoints = {
        accounts: {
            login: base + 'accounts/login',
            register: base + 'accounts',
            me: base + 'accounts/me',
            logout: base + 'accounts/logout',
            update: base + 'accounts',
            captcha: base + 'accounts/captcha',
            all: base + 'accounts',
            one: base + 'admin/accounts/{id}',
            admin: base + 'admin/accounts'
        },
        strings: '/resources/strings.json'
    };

    function modelEndpoints (model) {
        return {
            all: base + model,
            one: base + model + '/{id}',
            image: base + model + '/image',
            shops: base + model.slice(0, -1) + '/shops',
            image_id: base + model + '/image/{id}',
            admin_all: base +'/admin/'+ model
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
