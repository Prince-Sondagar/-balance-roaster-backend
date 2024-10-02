const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Documents extends Model {
    static associate(db) {
      db.Document.belongsTo(db.User, {as: 'user', foreignKey: 'userId' })
     }
  }

  Documents.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
      validate: { notNull: { msg: "Name is required" } }
    },
    awsName: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
      validate: { notNull: { msg: "awsName is required" } }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "Location is required" } }
    },
    isReportGenerated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    key:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "Key is required" } }
    },
    tag:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "Tag is required" } }
    },
    reportAwsName: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: true
    },
    reportLocation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reportKey:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Document',
    hooks: {
      afterCreate(row) {
      }
    }
  });

  return Documents;
};