'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.comment.belongsTo(models.User,{
        foreignKey: {
          allowNull: false
        }
      })
      models.comment.belongsTo(models.Post,{
        foreignKey: {
          allowNull: false
        }
      })
    }
  }
  Comment.init({
    idUSERS: DataTypes.INTEGER,
    content: DataTypes.STRING,
    attachement: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER,
    userLike: DataTypes.STRING,
    userDislike: DataTypes.STRING,
    date: DataTypes.STRING,
    POST_idPOST: DataTypes.INTEGER,
    POST_idUSERS: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};