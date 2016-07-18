exports.default = function (data) {
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
    if (model.user) {
        delete model.user['user_role'];
        delete model.user['max_car'];
        delete model.user['password'];
        delete model.user['createdAt'];
        delete model.user['updatedAt'];
    }
    if (model.repair_works && model.repair_works.length) {
        for (var i = 0; i < model.repair_works.length; i++) {
            model.repair_works[i].work = model.repair_works[i].work + '';
        }
    }
    return model;
}

exports.share = function (data) {
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
    if (model.work) {
        delete model['work'];
    }
    if (model.repair_shop) {
        delete model['repair_shop'];
    }
    if (model.for_car) {
        delete model['for_car'];
    }
    if (model.owner) {
        delete model['owner'];
    }
    if (model.share) {
        delete model['share'];
    }
    if (model.user.file) {
        model.user.image = model.user.file;
        delete model.user['file'];
    }
    if (model.car) {
        delete model.car['exp_date'];
        delete model.car['createdAt'];
        delete model.car['updatedAt'];
        delete model.car['date'];
    }
    if (model.workgroup) {
        delete model.workgroup['createdAt'];
        delete model.workgroup['updatedAt'];
    }
    if (model.user) {
        delete model.user['user_role'];
        delete model.user['max_car'];
        delete model.user['password'];
        delete model.user['createdAt'];
        delete model.user['updatedAt'];
    }
    if (model.repair_works && model.repair_works.length) {
        for (var i = 0; i < model.repair_works.length; i++) {
            model.repair_works[i].work = model.repair_works[i].work + '';
        }
    }
    return model;
}