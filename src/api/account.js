'use strict';
var Authorize = require('../authorize/auth');
var BaseApi = require('./base');
var User = require('../database/models').User;
var Role = require('../database/models').Role;
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
var FB = require('fb'),
    fb = new FB.Facebook({version: 'v2.6'});
	
class AccountApi extends BaseApi {

    registerModel (data) {
        return {
            email: data.email,
            password: bcrypt.hashSync(data.password, salt),
            name: data.name,
            user_role: 2
        };
    }

    loginSerializer (data) {
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

    comparePassword (password, hash) {
        return bcrypt.compareSync(password?password:'', hash);
    }

    findByEmail (email) {
        var promise = new Promise(function (resolve, reject) {
            User.findAll({
                where: { email: email },
                include: [
                    { model: Role }
                ]
            }).then(function (users) {
                resolve(users);
           }).catch(function (err) {
               reject(err);
           });
        });
        return promise;
    }

    validateLogin (data) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            if (!data.email) {
                reject({ message: 'EMAIL REQUIRED' });
            }
            else if (!data.password) {
                reject({ message: 'PASSWORD REQUIRED' });
            }
            else {
                me.findByEmail(data.email).then(function (users) {
                    if (users.length) {
                        var user = users[0].dataValues;
                        if (me.comparePassword(data.password, user.password)) {
                            resolve(user);
                        }
                        else {
                            reject({ message: 'INVALID' });
                        }
                    }
                    else {
                        reject({ message: 'INVALID' });
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
        return promise;
    }

    validateRegister (data, is_facebook) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            if (!data.email) {
                reject({ message: 'EMAIL REQUIRED' });
            }
            else if (!data.password && !is_facebook) {
                reject({ message: 'PASSWORD REQUIRED' });
            }
            else {
                me.findByEmail(data.email).then(function (users) {
                    if (users.length) {
                        reject({ message: 'EMAIL EXIST' });
                    }
                    else {
                        resolve();
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
        return promise;
    }

    getAll (context, req, res) {
        User.all().then(function (data) {
            context.success(req, res, data);
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    validateUpdate (data) {
        var me = this;
        var promise = new Promise(function (resolve, reject) {
            if (!data.email) {
                reject({ message: 'EMAIL REQUIRED' });
            }
            else {
                resolve();
            }
        });
        return promise;
    }

    update (context, req, res) {
        var user = req.body;
        User.findById(req.user.id, {
            include: [
                { model: Role }
            ]
        }).then(function (_user) {
            if (_user) {
                console.log('here', _user);
                if (_user.id === req.user.id) {
                    var valid_password_process = true;
                    if (user.password) {
                        if (_user.password) {
                            if (context.comparePassword(user.old_password, _user.password)) {
                                user.password = bcrypt.hashSync(user.password);
                            }
                            else {
                                valid_password_process = false;
                            }
                        }
                        else {
                            user.password = bcrypt.hashSync(user.password);
                        }
                    }
                    if (valid_password_process) {
                        user.email = _user.email;
                        context.validateUpdate(user).then(function () {
                            _user.updateAttributes(user).then(function (data) {
                                var aut_user = context.loginSerializer(data);
                                Authorize.updateAuthorizeUser(aut_user).then(function () {
                                    context.success(req, res, data);
                                }).catch(function (err) {
                                    context.error(req, res, err, 500);
                                });
                            }).catch(function () {
                                context.error(req, res, err, 500);
                            });
                        }).catch(function (err) {
                            context.error(req, res, err, 400);
                        });
                    }
                    else {
                        context.error(req, res, 'INVALID OLD PASSWORD', 400);
                    }
                }
                else {
                    context.error(req, res, 'PERMISSION DENIED', 401);
                }
            }
            else {
                context.error(req, res, 'NOT FOUND', 404);
            }
        }).catch(function (err) {
            context.error(req, res, err, 500);
        });
    }

    login (context, req, res) {
		if(req.body && req.body.fb_token) {
			context.facebookLogin(context, req, res);
		}
		else {
			context.validateLogin(req.body).then(function (_user) {
            var user = context.loginSerializer(_user);
            Authorize.authorizeUser(user).then(function (auth_user) {
                context.success(req, res, auth_user);
				}).catch(function (err) {
					context.error(req, res, err, 500);
				});
			}).catch(function (err) {
				context.error(req, res, err, 400);
			});
		}
    }
	
	facebookLogin (context, req, res) {
		FB.setAccessToken(req.body.fb_token);
		FB.api('/me?fields=name,email', function (_res) {
			if(!_res || _res.error) {
				var err = !_res ? { message:'error occurred'} : _res.error;
				context.error(req, res, err, 500);
			}
			else {
				context.findByEmail(_res.email).then(function (users) {
					if (users.length) {
						var user = context.loginSerializer(users[0]);
						Authorize.authorizeUser(user).then(function (auth_user) {
							context.success(req, res, auth_user);
						}).catch(function (err) {
							context.error(req, res, err, 500);
						});
					}
					else {
						var data = {
							email: _res.email,
							name: _res.name,
                            password: ''
						};
						context.validateRegister(data, true).then(function () {
							var user = context.registerModel(data);
							User.create(user, { isNewRecord: true }).then(function (model) {
								context.findByEmail(_res.email).then(function (_users) {
									if(_users.length) {
										var _user = context.loginSerializer(_users[0]);
										Authorize.authorizeUser(_user).then(function (auth_user) {
											context.success(req, res, auth_user);
										}).catch(function (err) {
											context.error(req, res, err, 500);
										});
									}
									else {
										context.error(req, res, {message: 'USER NOT FOUND'}, 404);
									}
								}).catch(function(err){
									context.error(req, res, err, 500);
								});
							}).catch(function (err) {
								context.error(req, res, err, 500);
							});
						}).catch(function (err) {
							context.error(req, res, err, 400);
						});
					}
				}).catch(function (err) {
					context.error(req, res, err, 500);
				});
			}
		});
	}

    register (context, req, res) {
        var data = req.body;
        context.validateRegister(data).then(function () {
            var model = context.registerModel(data);
            User.create(model, { isNewRecord: true }).then(function (_user) {
                var user = context.loginSerializer(_user);
                User.findById(user.id, {
                    include: [
                        { model: Role }
                    ]
                }).then(function (___user) {
                    var auth_user = context.loginSerializer(___user);
                    Authorize.authorizeUser(auth_user).then(function (login_user) {
                        context.success(req, res, login_user);
                    }).catch(function (err) {
                        context.error(req, res, err, 500);
                    });
                }).catch(function (err) {
                    context.error(req, res, err, 500);
                });
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }).catch(function (err) {
            context.error(req, res, err, 400);
        });
    }

    logout (context, req, res) {
        var user = req.user;
        if (user && user.email) {
            Authorize.removeUser(user).then(function () {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
        else {
            context.error(req, res, {message:'SESSION NOT FOUND'}, 500);
        }
    }

    me (context, req, res) {
        context.success(req, res, req.user);
    }

    delete (context, req, res) {
        if (req.params.id) {
            User.destroy({ where: { id: req.params.id } }).then(function (model) {
                context.success(req, res, {});
            }).catch(function (err) {
                context.error(req, res, err, 500);
            });
        }
    }

    endpoints () {
        return [
            { url: '/accounts', method: 'get', roles: ['admin'], response: this.getAll },
			{ url: '/accounts/login', method: 'post', roles: [], response: this.login },
            { url: '/accounts', method: 'post', roles: [], response: this.register },
            { url: '/accounts', method: 'patch', roles: ['admin', 'user'], response: this.update },
            { url: '/accounts', method: 'delete', roles: ['admin'], response: this.delete, params: ['id'] },
            { url: '/accounts/me', method: 'get', roles: ['admin', 'user'], response: this.me },
            { url: '/accounts/logout', method: 'post', roles: ['admin', 'user'], response: this.logout }
        ];
    }
}

module.exports = new AccountApi();
