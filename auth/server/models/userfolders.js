'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userFolders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userFolders.init({
    userID: DataTypes.INTEGER,
    folderID: DataTypes.STRING,
    folderName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userFolders',
  });
  return userFolders;
};