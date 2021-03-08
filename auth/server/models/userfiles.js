'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userFiles.init({
    userID: DataTypes.INTEGER,
    folderID: DataTypes.INTEGER,
    folderName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userFiles',
  });
  return userFiles;
};