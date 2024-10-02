const { hashSync, genSaltSync } = require('bcrypt');
const { Model } = require('sequelize');
const { saltRounds } = require('../config');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(db) {
      db.User.hasMany(db.Document, { as: 'document', foreignKey: 'userId' })
      db.User.hasOne(db.Subscription, { as: 'subscription', foreignKey: 'userId' })
    }
  }

  Users.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      trim: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue('email', value.toLocaleLowerCase());
      }
    },
    avatar: {
      type: DataTypes.STRING,
      trim: true
    },
    password: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
      set(value) {
        this.setDataValue('password', hashSync(value, genSaltSync(saltRounds)));
      }
    },
    stripe_id: {
      type: DataTypes.STRING,
      trim: true
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      afterCreate(row) {
        delete row.dataValues.password
        delete row.dataValues.createdAt
        delete row.dataValues.updatedAt
        delete row.dataValues.avatar
      }
    }
  });

  return Users;
};