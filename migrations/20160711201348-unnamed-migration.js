'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
           'shops',
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
                   allowNull: false
               },
               owner_name: {
                   type: Sequelize.STRING
               },
               create_by: {
                   type: Sequelize.INTEGER,
                   llowNull: false,
                   references: {
                       model: 'users',
                       key: 'id'
                   }
               },
               update_by: {
                   type: Sequelize.INTEGER,
                   llowNull: false,
                   references: {
                       model: 'users',
                       key: 'id'
                   }
               },
               address: {
                   type: Sequelize.STRING,
                   allowNull: false
               },
               telephone: {
                   type: Sequelize.STRING,
                   allowNull: false
               },
               image: {
                   type: Sequelize.INTEGER,
                   references: {
                       model: 'files',
                       key: 'id'
                   }
               },
               city: {
                   type: Sequelize.STRING
               },
               lat: {
                   type: Sequelize.DECIMAL
               },
               lon: {
                   type: Sequelize.DECIMAL
               },
               map: {
                   type: Sequelize.STRING(2000)
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
