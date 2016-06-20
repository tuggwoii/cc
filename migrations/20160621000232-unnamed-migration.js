'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
        'logs',
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
            user: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            url: {
                type: Sequelize.STRING
            },
            message: {
                type: Sequelize.STRING
            },
            data: {
                type: Sequelize.STRING
            },
            params: {
                type: Sequelize.STRING
            },
            stack: {
                type: Sequelize.STRING(1000)
            },
            status: {
                type: Sequelize.STRING
            }
        }).then(function () {
            console.log('success');
        }).catch(function (err) {
            console.log(err);
        });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
