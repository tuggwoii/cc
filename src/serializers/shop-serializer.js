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
        delete model.create_user['ip'];
        delete model.create_user['ban'];
        delete model.create_user['forgot_password_token'];
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
        delete model.update_user['ip'];
        delete model.update_user['ban'];
        delete model.update_user['forgot_password_token'];
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
    if (model.repairs) {
        model.repairs = model.repairs.length;
    }
    else {
        model.repairs = 0;
    }
    return model;
}