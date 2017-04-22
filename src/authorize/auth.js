'use strict';
var crypto = require('crypto');
var fs = require('fs');
var tokenSession;
var authoPath = '/src/authorize/authorizeSession.txt';

function readUserSession() {
    if (tokenSession) {
        return tokenSession;
    }
    else {
        tokenSession = JSON.parse(fs.readFileSync(appRoot + authoPath, 'utf8'));
        if (!tokenSession) {
            tokenSession = {};
        }
        return tokenSession;
    } 
}

function saveUserSession() {
    tokenSession = readUserSession();
    var data = JSON.stringify(tokenSession);
    if (data) {
        fs.writeFileSync(appRoot + authoPath, data, 'utf8');
    }
}

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
    tokenSession = readUserSession();
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
            tokenSession = readUserSession();
            user.token = token;
            tokenSession[token] = user;
            saveUserSession();
            resolve(user);
        }).catch(function (err) {
            reject(err);
        });
    });
    return promise;
};

exports.updateAuthorizeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        tokenSession = readUserSession();
        for (var token in tokenSession) {
            if (tokenSession[token].id === user.id) {
                tokenSession[token] = user;
                saveUserSession();
            }
        }
        resolve(user);
    });
    return promise;
};

exports.removeAuthorizeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        tokenSession = readUserSession();
        var isAny = false;
        for (var token in tokenSession) {
            if (tokenSession[token].id === user.id) {
                isAny = true;
                delete tokenSession[token];
            }
        }
        if (isAny) {
            saveUserSession();
        }
        resolve();
    });
    return promise;
};

exports.removeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        tokenSession = readUserSession();
        if (tokenSession[user.token]) {
            delete tokenSession[user.token];
            saveUserSession();
            resolve();
        }
        else {
            reject({ message: 'SESSION NOT FOUND' });
        }
    });
    return promise;
};

exports.isAuthorize = function (request, roles) {
    tokenSession = readUserSession();
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
    tokenSession = readUserSession();
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
    tokenSession = readUserSession();
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
