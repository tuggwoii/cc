'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn(
          'repairs',
          'share',
          {
              type: Sequelize.BOOLEAN
          }).then(function () {
                      queryInterface.addColumn(
                 'repairs',
                 'remark',
                 {
                     type: Sequelize.STRING(2000)
                 }).then(function () {
                     queryInterface.addColumn(
                 'repairs',
                 'score',
                 {
                     type: Sequelize.DECIMAL
                 }).then(function () {
                     console.log('success');
                 }).catch(function (err) {
                     console.log(err);
                 });
                 }).catch(function (err) {
                     console.log(err);
                 });
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
