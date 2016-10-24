'use strict';
var Sequelize = require('sequelize');
var configs = require('../../config/config');
var config = require('../../config/config')[configs.env];
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mssql',
    pool: {
        maxConnections: 100,
        minConnections: 0,
        maxIdleTime: 10000
    },
    dialectOptions: {
      encrypt: true
    },
    omitNull: true
});
module.exports = sequelize;