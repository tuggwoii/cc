'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
          'notifications',
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
              title: {
                  type: Sequelize.STRING,
                  allowNull: false
              },
              type: {
                  type: Sequelize.INTEGER,
                  allowNull: false
              },
              mile: {
                  type: Sequelize.INTEGER
              },
              date: {
                  type: Sequelize.DATE
              },
              detail: {
                  type: Sequelize.STRING(2000)
              },
              workId: {
                  type: Sequelize.INTEGER,
                  allowNull: false,
                  references: {
                      model: 'workgroup',
                      key: 'id'
                  }
              },
              carId: {
                  type: Sequelize.INTEGER,
                  allowNull: false,
                  references: {
                      model: 'cars',
                      key: 'id'
                  }

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
