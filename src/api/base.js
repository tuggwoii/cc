'use strict';
var Log = require('../helpers/log');
class BaseApi {

    serializer (data) {
        if (!data.id) {
            if (data['null']) {
                data['id'] = data['null'];
            }
            else {
                data['id'] = 0;
            }
        }
        var json = JSON.stringify(data);
        var model = JSON.parse(json);
        if (model.password) {
            delete model['password'];
        }
        if (model.user) {
            delete model.user['password'];
            delete model.user['createdAt'];
            delete model.user['updatedAt'];
            delete model.user['forgot_password_token'];
            delete model.user['ip'];
        }
        if (model.role) {
            delete model.role['createdAt'];
            delete model.role['updatedAt'];
        }
        if (model.token) {
            delete model['createdAt'];
            delete model['updatedAt'];
            delete model['user_role'];
        }
        if (model.file) {
            model.image = model.file;
            delete model.image['createdAt'];
            delete model.image['updatedAt'];
            delete model['file'];
        }
        if (model.forgot_password_token) {
            delete model['forgot_password_token'];
        }
        return model;
    }

    serializerList (collection, serializer) {
        var json = JSON.stringify(collection);
        var serializer = serializer ? serializer : this.serializer
        var collectios = JSON.parse(json);
        for (var i = 0; i < collectios.length; i++) {
            collectios[i] = serializer(collectios[i]);
        }
        return collectios;
    }

    success (req, res, model, meta, serializer) {
        if (model.length) {
            res.json({
                data: this.serializerList(model, serializer),
                error: [],
                meta: meta ? meta : {}
            });
        }
        else {
            res.json({
                data: serializer ? serializer(model) : this.serializer(model),
                error: [],
                meta: meta ? meta : {}
            });
        }
    }

    error (req, res, err, status) {
        var code = status || 400;
        var error = {
            url: '/api/v1' + req.url,
            data: req.body ? JSON.stringify(req.body) : '',
            params: req.params ? JSON.stringify(req.params) : '',
            message: err.message ? err.message : err?err:'',
            stack: err.stack ? err.stack : '',
            status: code
        };
        if (req.user) {
            error.user = req.user.id
        }
        Log.logToDatabase(error);
        res.status(code).json({
            data: {},
            error: error,
            meta: {}
        });
    }

    denied (res) {
        res.status(401).json({
            data: {},
            error: {
                message: 'PERMISSION DENIED'
            },
            meta: {}
        });
    }

    notfound (res) {
        res.status(404).json({
            data: {},
            error: {
                message: 'NOT FOUND'
            },
            meta: {}
        });
    }

    endpoints () {
        return {};
    }
}

module.exports = BaseApi;
