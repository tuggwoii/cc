'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn(
                           'notifications',
                           'repairId',
                           {
                               type: Sequelize.INTEGER,
                               allowNull: true,
                               references: {
                                   model: 'repairs',
                                   key: 'id'
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
