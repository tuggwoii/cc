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