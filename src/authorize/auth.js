'use strict';
var crypto = require('crypto');
var tokenSession = [];
var userSession = [];

function generateToken () {
    var promise = new Promise(function (resolve, reject) {
        crypto.randomBytes(16, function (err, buf) {
            if (err) reject(err);
            var token = buf.toString('hex');
            resolve(token);
        });
    });
    return promise;
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

            //OPOEN FOR SINGLE DEVICE LOGIN
            //if (userSession[user.id]) {
                //delete tokenSession[userSession[user.id]]; 
            //}
            console.log('setAutho', user);
            tokenSession[token] = user;
            userSession[user.id] = token;
            user.token = token;
            resolve(user);
        }).catch(function (err) {
            reject(err);
        });
    });
    return promise;
};

exports.updateAuthorizeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        var token = userSession[user.id];
        if (token) {
            tokenSession[token] = user;
            resolve(user);
        }
        else {
            reject('NO TOKEN');
        }
    });
    return promise;
};

exports.removeUser = function (user) {
    var promise = new Promise(function (resolve, reject) {
        if (userSession[user.id]) {
            var token = userSession[user.id];
            delete tokenSession[token];
            delete userSession[user.id];
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
