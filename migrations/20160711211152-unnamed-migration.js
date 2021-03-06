'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.removeColumn(
           'repairs',
           'owner').then(function () {
               queryInterface.addColumn(
          'repairs',
          'userId',
          {
              type: Sequelize.INTEGER,
              references: {
                  model: 'users',
                  key: 'id'
              }
          }).then(function () {
              console.log('success');
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
