'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
     'roles',
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

         }
     }).then(function () {
         console.log('success');
     }).catch(function (err) {
         console.log(err);
     });
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable(
      'roles');
  }
};
