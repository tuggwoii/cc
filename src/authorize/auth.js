'use strict';
var crypto = require('crypto');
var tokenSession = [];

function generateToken () {
    var promise = new Promise(function (resolve, reject) {
        crypto.randomBytes(48, function (err, buf) {
            if (err) reject(err);
            var token = buf.toString('hex');
            resolve(token);
        });
    });
    return promise;
}

function permission (res) {
    res.status(401).json({
        data: [],
        error: {
            message: 'PERMISSION DENIED'
        },
        meta: []
    });
}

exports.getUser = function (token) {
    if (tokenSession[token]) {
        return tokenSession[token];
    }
    else {
        return null;
    }
};

exports.authorizeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        generateToken().then(function (token) {
            user.token = token;
            tokenSession[token] = user;
            resolve(user);
        }).catch(function (err) {
            reject(err);
        });
    });
    return promise;
};

exports.updateAuthorizeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        for (var token in tokenSession) {
            if (tokenSession[token].id === user.id) {
                tokenSession[token] = user;
            }
        }
        resolve(user);
    });
    return promise;
};

exports.removeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        if (tokenSession[user.token]) {
            delete tokenSession[user.token];
            resolve();
        }
        else {
            reject({ message: 'SESSION NOT FOUND' });
        }
    });
    return promise;
};

exports.isAuthorize = function (request, roles) {
    var token = request.headers['authorization'];
    if (!token) {
        return false;
    }
    var user = tokenSession[token];
    request.user = user;
    if (!user) {
        return false;
    }
    return roles.indexOf(user.role.name) > -1;
};

exports.isPageAuthorize = function (req, roles) {
    var token = req.cookies.Authorization;
    if (!token) {
        return false;
    }
    var user = tokenSession[token];
    req.user = user;
    if (!user) {
        return false;
    }
    return roles.indexOf(user.role.name) > -1;
};

exports.protectPath = function (request, response, next) {
    var token = request.headers['authorization'];
    if (!token) {
        permission(response);
    }
    else {
        var user = tokenSession[token];
        if (user) {
            request.user = user;
            next();
        }
        else {
            permission(response);
        }
    }    
};
