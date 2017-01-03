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
        model.notification_list = model.notifications;
        model.notifications = model.notifications.length;
    }
    model.file_usage = 0;
    if (model.repairs) {
        for (var i = 0; i < model.repairs.length; i++) {
            var current_repair = model.repairs[i];
            if (current_repair.repair_images && current_repair.repair_images.length) {
                for (var j = 0; j < current_repair.repair_images.length; j++) {
                    var repair_image = current_repair.repair_images[j];
                    if (repair_image.file) {
                        model.file_usage = model.file_usage + repair_image.file.size;
                    }
                }
            }
        }
        model.repairs = model.repairs.length;
    }
    if (model.file_usage > 0) {
        model.file_usage = model.file_usage / (1024 * 1024)
    }

    return model;
}