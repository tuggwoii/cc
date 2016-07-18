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
    if (model.create_user) {
        delete model.create_user['user_role'];
        delete model.create_user['max_car'];
        delete model.create_user['password'];
        delete model.create_user['createdAt'];
        delete model.create_user['updatedAt'];

        if (model.create_user.file) {
            delete model.create_user.file['owner'];
            delete model.create_user.file['is_use'];
            delete model.create_user.file['size'];
            delete model.create_user.file['createdAt'];
            delete model.create_user.file['updatedAt'];
        } 
        
    }
    if (model.update_user) {
        delete model.update_user['user_role'];
        delete model.update_user['max_car'];
        delete model.update_user['password'];
        delete model.update_user['password'];
        delete model.update_user['createdAt'];
        delete model.update_user['updatedAt'];

        if (model.update_user.file) {
            delete model.update_user.file['owner'];
            delete model.update_user.file['is_use'];
            delete model.update_user.file['size'];
            delete model.update_user.file['createdAt'];
            delete model.update_user.file['updatedAt'];
        }
    }
    if (model.file) {
        model.image = model.file;
        delete model.image['createdAt'];
        delete model.image['updatedAt'];
        delete model['file'];
    }
    return model;
}