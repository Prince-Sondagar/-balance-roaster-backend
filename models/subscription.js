const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Subscriptions extends Model {
    static associate(db) {
      db.Subscription.belongsTo(db.User, {as: 'user', foreignKey: 'userId' })
    }
  }

  Subscriptions.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      trim: true,
      defaultValue: false,
    },
    startDate: {
      type: DataTypes.DATE,
      trim: true,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      trim: true,
      allowNull: true,
    },
    lastReneWalDate: {
      type: DataTypes.DATE,
      trim: true,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      trim: true,
      defaultValue: '$',
      allowNull: false
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripeProductId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripePriceId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    }


  }, {
    sequelize,
    modelName: 'Subscription',
    hooks: {
      afterCreate(row) {
      }
    }
  });

  return Subscriptions;
};



