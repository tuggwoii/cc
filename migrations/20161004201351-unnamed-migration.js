'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
                   'contacts',
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
                       detail: {
                           type: Sequelize.STRING
                       },
                       type: {
                           type: Sequelize.INTEGER
                       },
                       by: {
                           type: Sequelize.INTEGER,
                           allowNull: false,
                           references: {
                               model: 'users',
                               key: 'id'
                           }
                       },
                       car: {
                           type: Sequelize.INTEGER,
                           references: {
                               model: 'cars',
                               key: 'id'
                           }
                       },
                       datetime: {
                           type: Sequelize.STRING
                       },
                       status: {
                           type: Sequelize.INTEGER
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
