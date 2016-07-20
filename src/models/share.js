'use strict';
var Base = require('./base');
var Repair = require('../database/models').Repair;
var Car = require('../database/models').Car;
var Work = require('../database/models').Workgroup;
var User = require('../database/models').User;
var Shop = require('../database/models').Shop;
var RepairWork = require('../database/models').RepairWork;
var File = require('../database/models').File;
var serializer = require('../serializers/repair-serializer');

class Share extends Base {

    response(context, req, res, route) {
        if (req.params.id && !isNaN(req.params.id)) {
            Repair.findOne({
                where: { share: true, id: req.params.id },
                include: [
                    { model: Car },
                    { model: Work },
                    { model: User, include: [{ model: File }] },
                    { model: Shop },
                    { model: RepairWork }
                ]
            }).then(function (_data) {
                if (_data) {
                    var model = serializer.share(_data);
                    console.log(model);
                    res.status(200).render(route.view, model);
                }
                else {
                    context.notfound(res);
                }
            }).catch(function (err) {
                console.log(err.stack);
                context.error(res);
            })
        }
        else {
            context.notfound(res);
        }
    }

}

module.exports = new Share();
