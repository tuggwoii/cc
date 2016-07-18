'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
            'repairs',
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
                mile: {
                    type: Sequelize.INTEGER
                },
                date: {
                    type: Sequelize.DATE
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

                },
                shopId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'shops',
                        key: 'id'
                    }
                },
                owner: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
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
