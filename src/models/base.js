'use strict';
class BaseModel {

    constructor () {

    }

    serialize (data) {
        return data;
    }

    save () {

    }

    isValid () {
        return true;
    }

    notfound(res) {
        res.status(404).render('pages/404.html');
    }

    error(res) {
        res.status(500).render('pages/500.html');
    }
}

module.exports = BaseModel;
