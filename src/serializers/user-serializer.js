exports.admin = function (data) {
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

    return model;
}

exports.login = function (data) {
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
    var user = {
        id: model.id,
        name: model.name,
        email: model.email,
        role: model.user_role,
        ban: model.ban,
        token: model.token,
        role: model.role
    };
    if (user.role) {
        delete user.role.createdAt;
        delete user.role.updatedAt;
    }
    return user;
}

exports.me = function (data) {
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
    delete model.ip;
    delete model.forgot_password_token;
    delete model.createdAt;
    delete model.updatedAt;
    delete model.password;
    delete model.ban;
    return model;
}