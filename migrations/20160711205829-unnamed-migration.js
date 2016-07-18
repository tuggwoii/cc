'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
               'work_images',
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
                   caption: {
                       type: Sequelize.STRING(2000)
                   },
                   imageId: {
                       type: Sequelize.INTEGER,
                       allowNull: false,
                       references: {
                           model: 'files',
                           key: 'id'
                       }
                   },
                   workId: {
                       type: Sequelize.INTEGER,
                       allowNull: false,
                       references: {
                           model: 'repair_works',
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
