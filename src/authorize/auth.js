'use strict';
var log = require('../helpers/log.js');
var fs = require('fs');
var secretKeyPath = '/src/authorize/secret_key.txt';
var jwt = require('jsonwebtoken');

function generateToken(user) {
    var promise = new Promise(function (resolve, reject) {
        var expiresIn = new Date();
        expiresIn = expiresIn.setDate(expiresIn.getDate() + 30);
        user.expiresIn = expiresIn;
        var secretKey = fs.readFileSync(appRoot + secretKeyPath, 'utf8');
        jwt.sign(user, secretKey, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
    return promise;
}

function decryptUserByTokenAsync(token) {
    var promise = new Promise(function (resolve, reject) {
        var secretKey = fs.readFileSync(appRoot + secretKeyPath);
        jwt.verify(token, secretKey, function (err, user) {
            if (err) {
                reject(err);
            } else {
                if (user.expiresIn < new Date()) {
                    reject('token expired');
                } else {
                    resolve(user);
                }
            }
        });
    });
    return promise;
}
function decryptUserByToken(token) {
    var secretKey = fs.readFileSync(appRoot + secretKeyPath);
    var user = jwt.verify(token, secretKey);
    return user;
}

function rejectPermission (res) {
    res.status(401).json({
        data: [],
        error: {
            message: 'PERMISSION DENIED'
        },
        meta: []
    });
}

exports.getUser = function (token) {
    return decryptUserByToken(token);
};

exports.authorizeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        generateToken(user).then(function (token) {
            user.token = token;
            resolve(user);
        }).catch(function (err) {
            reject(err);
        });
    });
    return promise;
};

exports.isAuthorize = function (request, roles) {
    var token = request.headers['authorization'];
    if (!token) {
        return false;
    }
    var user = decryptUserByToken(token);
    if (!user) {
        return false;
    }
    request.user = user;
    return roles.indexOf(user.role.name) > -1;
};

exports.isPageAuthorize = function (request, roles) {
    var token = request.cookies.Authorization;
    if (!token) {
        return false;
    }
    var user = decryptUserByToken(token);
    if (!user) {
        return false;
    }
    request.user = user;
    return roles.indexOf(user.role.name) > -1;
};

exports.protectPath = function (request, response, next) {
    var token = request.headers['authorization'];
    if (!token) {
        rejectPermission(response);
    }
    else {
        var user = decryptUserByToken(token);
        if (!user) {
            rejectPermission(response);
        } else {
            request.user = user;
            next();
        }
    }    
};
