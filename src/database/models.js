﻿'use strict';
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
    image: {
        type: Sequelize.INTEGER,
        field: 'fileId'
    },
    max_car: {
        type: Sequelize.INTEGER,
        field: 'max_car'
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

var Workgroup = sequelize.define('workgroup', {
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
},{
freezeTableName: true
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
        type: Sequelize.INTEGER,
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
    },
    engine: {
        type: Sequelize.STRING,
        field: 'engine'
    },
    detail: {
        type: Sequelize.STRING,
        field: 'detail'
    },
    color: {
        type: Sequelize.STRING,
        field: 'color'
    },
    exp_date: {
        type: Sequelize.DATE,
        field: 'exp_date'
    }
});

var Notification = sequelize.define('notifications', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    title: {
        type: Sequelize.STRING,
        field: 'title'
    },
    type: {
        type: Sequelize.INTEGER,
        field: 'type'
    },
    mile: {
        type: Sequelize.INTEGER,
        field: 'mile'
    },
    date: {
        type: Sequelize.DATE,
        field: 'date'
    },
    detail: {
        type: Sequelize.STRING,
        field: 'detail'
    },
    for_car: {
        type: Sequelize.INTEGER,
        field: 'carId'
    },
    work: {
        type: Sequelize.INTEGER,
        field: 'workId'
    },
    owner: {
        type: Sequelize.INTEGER,
        field: 'userId'
    },
    enable: {
        type: Sequelize.BOOLEAN,
        field: 'enable'
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

var Repair = sequelize.define('repairs', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    title: {
        type: Sequelize.STRING,
        field: 'title'
    },
    mile: {
        type: Sequelize.INTEGER,
        field: 'mile'
    },
    date: {
        type: Sequelize.DATE,
        field: 'date'
    },
    work: {
        type: Sequelize.INTEGER,
        field: 'workId'
    },
    owner: {
        type: Sequelize.INTEGER,
        field: 'userId'
    },
    for_car: {
        type: Sequelize.INTEGER,
        field: 'carId'
    },
    repair_shop: {
        type: Sequelize.INTEGER,
        field: 'shopId'
    },
    score: {
        type: Sequelize.DECIMAL,
        field: 'score'
    },
    remark: {
        type: Sequelize.STRING,
        field: 'remark'
    },
    share: {
        type: Sequelize.BOOLEAN,
        field: 'share'
    },
    price: {
        type: Sequelize.DOUBLE,
        field: 'price'
    }
    
});

var RepairWork = sequelize.define('repair_works', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    detail: {
        type: Sequelize.STRING,
        field: 'detail'
    },
    for_repair: {
        type: Sequelize.INTEGER,
        field: 'repairId'
    },
    work: {
        type: Sequelize.INTEGER,
        field: 'workId'
    },
    owner: {
        type: Sequelize.INTEGER,
        field: 'owner'
    },
    price: {
        type: Sequelize.DOUBLE,
        field: 'price'
    }
});

var Shop = sequelize.define('shops', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    owner_name: {
        type: Sequelize.INTEGER,
        field: 'owner_name'
    },
    create_by: {
        type: Sequelize.INTEGER,
        field: 'create_by'
    },
    update_by: {
        type: Sequelize.INTEGER,
        field: 'update_by'
    },
    address: {
        type: Sequelize.STRING,
        field: 'address'
    },
    telephone: {
        type: Sequelize.STRING,
        field: 'telephone'
    },
    image: {
        type: Sequelize.INTEGER,
        field: 'image'
    },
    city: {
        type: Sequelize.STRING,
        field: 'city'
    },
    lat: {
        type: Sequelize.DECIMAL,
        field: 'lat'
    },
    lon: {
        type: Sequelize.DECIMAL,
        field: 'lon'
    },
    map: {
        type: Sequelize.STRING,
        field: 'map'
    },
    rating: {
        type: Sequelize.DOUBLE,
        field: 'rating'
    }
});

User.belongsTo(Role, { foreignKey: 'user_role' });
User.belongsTo(File, { foreignKey: 'image' });
File.belongsTo(User, { foreignKey: 'owner' });
Car.belongsTo(User, { foreignKey: 'owner' });
Car.belongsTo(File, { foreignKey: 'image' })
Car.hasMany(Notification, { foreignKey: 'for_car' });
Car.hasMany(Repair, { foreignKey: 'for_car' });
Log.belongsTo(User, { foreignKey: 'by' });
Notification.belongsTo(Car, { foreignKey: 'for_car' });
Notification.belongsTo(Workgroup, { foreignKey: 'work' });
Notification.belongsTo(User, { foreignKey: 'owner' });
Repair.belongsTo(User, { foreignKey: 'owner' });
Repair.belongsTo(Car, { foreignKey: 'for_car' });
Repair.belongsTo(Shop, { foreignKey: 'repair_shop' });
Repair.belongsTo(Workgroup, { foreignKey: 'work' });
Repair.hasMany(RepairWork, { foreignKey: 'for_repair' });
RepairWork.belongsTo(Repair, { foreignKey: 'for_repair' });
RepairWork.belongsTo(User, { foreignKey: 'owner' });
RepairWork.belongsTo(Workgroup, { foreignKey: 'work' });
Shop.belongsTo(User, { foreignKey: 'create_by', as: 'create_user' });
Shop.belongsTo(User, { foreignKey: 'update_by', as: 'update_user' });
Shop.belongsTo(File, { foreignKey: 'image' });
Shop.hasMany(Repair, { foreignKey: 'repair_shop' });

exports.User = User;
exports.Role = Role;
exports.File = File;
exports.Car = Car;
exports.Log = Log;
exports.Workgroup = Workgroup;
exports.Notification = Notification;
exports.Repair = Repair;
exports.Shop = Shop;
exports.RepairWork = RepairWork;