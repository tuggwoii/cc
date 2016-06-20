'use strict';
var Sequelize = require('sequelize');
var sequelize = require('./connection');

var User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    email: {
        type: Sequelize.STRING,
        field: 'email'
    },
    password: {
        type: Sequelize.STRING,
        field: 'password'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    user_role: {
        type: Sequelize.INTEGER,
        field: 'roleId'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    }
}, {
    freezeTableName: true
});

var Role = sequelize.define('roles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    }
});

var File = sequelize.define('files', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    url: {
        type: Sequelize.STRING,
        field: 'url'
    },
    size: {
        type: Sequelize.INTEGER,
        field: 'size'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    is_use: {
        type: Sequelize.BOOLEAN,
        field: 'is_use'
    },
    owner: {
        type: Sequelize.INTEGER,
        field: 'userId'
    }
});

var Car = sequelize.define('cars', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    image: {
        type: Sequelize.STRING,
        field: 'image'
    },
    serial: {
        type: Sequelize.INTEGER,
        field: 'serial'
    },
    brand: {
        type: Sequelize.STRING,
        field: 'brand'
    },
    series: {
        type: Sequelize.STRING,
        field: 'series'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    owner: {
        type: Sequelize.INTEGER,
        field: 'userId'
    },
    year: {
        type: Sequelize.INTEGER,
        field: 'year'
    },
    date: {
        type: Sequelize.DATE,
        field: 'date'
    }
});

var Log = sequelize.define('logs', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    url: {
        type: Sequelize.STRING,
        field: 'url'
    },
    data: {
        type: Sequelize.INTEGER,
        field: 'data'
    },
    params: {
        type: Sequelize.STRING,
        field: 'params'
    },
    message: {
        type: Sequelize.STRING,
        field: 'message'
    },
    by: {
        type: Sequelize.INTEGER,
        field: 'user'
    },
    stack: {
        type: Sequelize.STRING,
        field: 'stack'
    },
    status: {
        type: Sequelize.STRING,
        field: 'status'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    }
});

User.belongsTo(Role, { foreignKey: 'user_role' });
File.belongsTo(User, { foreignKey: 'owner' });
Car.belongsTo(User, { foreignKey: 'owner' });
Car.belongsTo(File, { foreignKey: 'image' })
Log.belongsTo(User, { foreignKey: 'by' });

exports.User = User;
exports.Role = Role;
exports.File = File;
exports.Car = Car;
exports.Log = Log;