'use strict';
var Log = require('../database/models').Log;
var User = require('../database/models').User;
var BaseApi = require('./base');


class LogApi extends BaseApi {


    getAll (context, req, res) {
        Log.all({
            include: [
                { model: User }
            ]
        }).then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    delete (context, req, res) {
        if (req.params.id) {
            Log.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
    }

    endpoints () {
        return [
			{ url: '/logs', method: 'get', roles: ['admin'], response: this.getAll },
            { url: '/logs', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] }
        ];
    }
}

module.exports = new LogApi();
