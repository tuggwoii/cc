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
        delete model.user['password'];
        delete model.user['createdAt'];
        delete model.user['updatedAt'];
    }
    if (model.file) {
        model.image = model.file;
        delete model.image['createdAt'];
        delete model.image['updatedAt'];
        delete model['file'];
    }
    if (model.notifications) {
        model.notifications = model.notifications.length;
    }
    if (model.repairs) {
        model.repairs = model.repairs.length;
    }

    return model;
}