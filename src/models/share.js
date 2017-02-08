'use strict';
var Base = require('./base');
var Repair = require('../database/models').Repair;
var Car = require('../database/models').Car;
var Work = require('../database/models').Workgroup;
var User = require('../database/models').User;
var Shop = require('../database/models').Shop;
var RepairWork = require('../database/models').RepairWork;
var RepairImage = require('../database/models').RepairImage;
var File = require('../database/models').File;
var serializer = require('../serializers/repair-serializer');

class Share extends Base {

    response(context, req, res, route) {
        if (req.params.id && !isNaN(req.params.id)) {
            Repair.findOne({
                where: { share: true, id: req.params.id },
                include: [
                    { model: Car, include: [{ model: File }] },
                    { model: Work },
                    { model: User, include: [{ model: File }] },
                    { model: Shop, include: [{ model: File }] },
                    { model: RepairWork, include: [{ model: Work }] },
                     { model: RepairImage, include: [{ model: File }] }
                ]
            }).then(function (_data) {
                if (_data) {
                    var model = serializer.share(_data);
                    res.status(200).render(route.view, model);
                }
                else {
                    context.notfound(res);
                }
            }).catch(function (err) {
                context.error(res);
            })
        }
        else {
            context.notfound(res);
        }
    }

}

module.exports = new Share();
