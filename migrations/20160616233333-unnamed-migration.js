'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
      'cars',
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
          image: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'files',
                  key: 'id'
              }
          },
          user: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'users',
                  key: 'id'
              }
          },
          serial: {
              type: Sequelize.STRING
          },
          brand: {
              type: Sequelize.STRING
          },
          year: {
              type: Sequelize.INTEGER
          },
          date: {
              type: Sequelize.DATE
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
