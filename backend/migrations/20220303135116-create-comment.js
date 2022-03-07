'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
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
        allowNull:false,
        type: Sequelize.STRING
      },
      userDislike: {
        allowNull:false,
        type: Sequelize.STRING
      },
      date: {
        allowNull:false,
        type: Sequelize.STRING
      },
      POST_idPOST: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'id'
        }
      },
      POST_idUSERS: {
        allowNull:false,
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
    await queryInterface.dropTable('Comments');
  }
};