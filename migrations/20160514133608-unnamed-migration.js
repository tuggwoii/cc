'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
    'users',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        name: {
            type: Sequelize.STRING,
        },
        roleId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    }).then(function () {
        console.log('success');
    }).catch(function (err) {
        console.log(err);
    });
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable(
       'users');
  }
};
