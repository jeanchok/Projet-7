'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idUSERS: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      title: {
        allowNull:false,
        type: Sequelize.STRING
      },
      content: {
        allowNull:false,
        type: Sequelize.STRING
      },
      attachement: {
        allowNull:true,
        type: Sequelize.STRING
      },
      likes: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      dislikes: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      userLike: {
        allowNull:true,
        type: Sequelize.INTEGER
      },
      userDislikes: {
        allowNull:true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};