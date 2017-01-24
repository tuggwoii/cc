var ratings = ['ไม่ระบุ', 'แย่มาก', 'แย่', 'พอได้', 'ดี', 'ดีมาก']
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
    if (model.car) {
        if (model.car.file) {
            model.car.image = model.car.file;
            delete model.car['file'];
        }
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
    
    if (model.car) {
        //delete model.car['exp_date'];
        delete model.car['createdAt'];
        delete model.car['updatedAt'];
        delete model.car['date'];
        if (model.car.file) {
            model.car.image = model.car.file;
            delete model.car['file'];
        }
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
        if (model.user.file) {
            model.user.image = model.user.file;
            delete model.user['file'];
        }
    }
    if (model.repair_works && model.repair_works.length) {
        for (var i = 0; i < model.repair_works.length; i++) {
            model.repair_works[i].work = model.repair_works[i].work + '';
        }
    }
    if (model.score) {
        model.rating_text = ratings[model.score];
    }
    else {
        model.rating_text = ratings[0];
    }
    return model;
}
exports.shops = function (data) {
    var shops = [];
    data = JSON.parse(JSON.stringify(data));
    for (var i = 0; i < data.repairs.length; i++) {
        if (data.repairs[i].shop) {
            var has = false;
            for (var j = 0; j < shops.length; j++) {
                if (data.repairs[i].shop.id == shops[j].id) {
                    has = true;
                }
            }
            if (!has) {
                shops.push(data.repairs[i].shop);
            }
        }
    }
    return shops;
}