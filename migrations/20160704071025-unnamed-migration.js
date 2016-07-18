'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.addColumn(
                   'cars',
                   'engine',
                   {
                       type: Sequelize.STRING

                   }).then(function () {

                       queryInterface.addColumn(
                       'cars',
                       'detail',
                       {
                           type: Sequelize.STRING(2000)

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
