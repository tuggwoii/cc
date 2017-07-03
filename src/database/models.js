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
    image: {
        type: Sequelize.INTEGER,
        field: 'fileId',
        allowNull: true
    },
    max_car: {
        type: Sequelize.INTEGER,
        field: 'max_car'
    },
    ip: {
        type: Sequelize.STRING,
        field: 'ip'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    ban: {
        type: Sequelize.BOOLEAN,
        field: 'ban'
    },
    forgot_password_token: {
        type: Sequelize.STRING,
        field: 'forgot_password_token'
    },
    telephone: {
        type: Sequelize.STRING,
        field: 'telephone'
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
    is_delete: {
        type: Sequelize.BOOLEAN,
        field: 'is_delete'
    },
    owner: {
        type: Sequelize.INTEGER,
        field: 'userId'
    },
    type: {
        type: Sequelize.INTEGER,
        field: 'type'
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
        field: 'image',
        allowNull: true
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
        field: 'year',
        allowNull: true
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
    },
    max_file_size: {
        type: Sequelize.INTEGER,
        field: 'max_file_size'
    },
    city: {
        type: Sequelize.STRING,
        field: 'city'
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
    },
    repair_id: {
        type: Sequelize.INTEGER,
        field: 'repairId'
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
    },
    view_count: {
        type: Sequelize.INTEGER,
        field: 'viewCount'
    },
    ip: {
        type: Sequelize.STRING,
        field: 'ip'
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
    title: {
        type: Sequelize.STRING,
        field: 'title'
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
        field: 'image',
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        field: 'city'
    },
    province: {
        type: Sequelize.STRING,
        field: 'province'
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
    },
    services: {
        type: Sequelize.STRING,
        field: 'services'
    },
    website: {
        type: Sequelize.STRING,
        field: 'website'
    }
});

var RepairImage = sequelize.define('repair_images', {
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
    repair_id: {
        type: Sequelize.INTEGER,
        field: 'repairId'
    },
    image_id: {
        type: Sequelize.INTEGER,
        field: 'imageId',
        allowNull: true
    },
    caption: {
        type: Sequelize.STRING,
        field: 'caption'
    },
    owner: {
        type: Sequelize.INTEGER,
        field: 'owner'
    }
});

var Contact = sequelize.define('contacts', {
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
    type: {
        type: Sequelize.INTEGER,
        field: 'type'
    },
    send_by: {
        type: Sequelize.INTEGER,
        field: 'by'
    },
    car_ids: {
        type: Sequelize.STRING,
        field: 'car'
    },
    datetime: {
        type: Sequelize.STRING,
        field: 'datetime'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'status'
    },
    price: {
        type: Sequelize.DOUBLE,
        field: 'price'
    },
    telephone: {
        type: Sequelize.STRING,
        field: 'telephone'
    }
});

var Report = sequelize.define('reports', {
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
    file_id: {
        type: Sequelize.INTEGER,
        field: 'fileId',
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        field: 'email'
    },
    name: {
        type: Sequelize.INTEGER,
        field: 'name'
    },
    message: {
        type: Sequelize.STRING,
        field: 'message'
    },
    count: {
        type: Sequelize.STRING,
        field: 'count'
    }
});

var Setting = sequelize.define('settings', {
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
    exp_year: {
        type: Sequelize.INTEGER,
        field: 'expYear',
        allowNull: true
    },
    exp_month: {
        type: Sequelize.INTEGER,
        field: 'expMonth'
    },
    admin_emails: {
        type: Sequelize.STRING,
        field: 'adminEmails'
    }
});

User.belongsTo(Role, { foreignKey: 'user_role' });
User.belongsTo(File, { foreignKey: 'image' });
User.hasMany(Car, { foreignKey: 'owner' });
User.hasMany(Contact, { foreignKey: 'send_by' });
File.belongsTo(User, { foreignKey: 'owner' });
File.hasMany(RepairImage, { foreignKey: 'image_id' });
File.hasMany(Car, { foreignKey: 'image' });
File.hasMany(Shop, { foreignKey: 'image' });
Car.belongsTo(User, { foreignKey: 'owner' });
Car.belongsTo(File, { foreignKey: 'image' })
Car.hasMany(Notification, { foreignKey: 'for_car' });
Car.hasMany(Repair, { foreignKey: 'for_car' });
Log.belongsTo(User, { foreignKey: 'by' });
Notification.belongsTo(Car, { foreignKey: 'for_car' });
Notification.belongsTo(Workgroup, { foreignKey: 'work' });
Notification.belongsTo(User, { foreignKey: 'owner' });
Notification.belongsTo(Repair, { foreignKey: 'repair_id' });
Repair.belongsTo(User, { foreignKey: 'owner' });
Repair.belongsTo(Car, { foreignKey: 'for_car' });
Repair.belongsTo(Shop, { foreignKey: 'repair_shop' });
Repair.belongsTo(Workgroup, { foreignKey: 'work' });
Repair.hasMany(RepairWork, { foreignKey: 'for_repair' });
Repair.hasMany(RepairImage, { foreignKey: 'repair_id' });
Repair.hasMany(Notification, { foreignKey: 'repair_id' });
RepairWork.belongsTo(Repair, { foreignKey: 'for_repair' });
RepairWork.belongsTo(User, { foreignKey: 'owner' });
RepairWork.belongsTo(Workgroup, { foreignKey: 'work' });
Shop.belongsTo(User, { foreignKey: 'create_by', as: 'create_user' });
Shop.belongsTo(User, { foreignKey: 'update_by', as: 'update_user' });
Shop.belongsTo(File, { foreignKey: 'image' });
Shop.hasMany(Repair, { foreignKey: 'repair_shop' });
RepairImage.belongsTo(File, { foreignKey: 'image_id' });
RepairImage.belongsTo(Repair, { foreignKey: 'repair_id' });
RepairImage.belongsTo(User, { foreignKey: 'owner' });
Contact.belongsTo(User, { foreignKey: 'send_by' });
Report.belongsTo(File, { foreignKey: 'file_id' });

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
exports.RepairImage = RepairImage;
exports.Contact = Contact;
exports.Report = Report;
exports.Setting = Setting;