'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.addColumn(
   'files',
   'user',
   {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
           model: 'users',
           key: 'id'
       }
         
      }).then(function () {
          console.log('success');
      }).catch(function (err) {
          console.log(err);
      });
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable(
         'files');
    }
};