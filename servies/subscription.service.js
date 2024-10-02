const { Subscription } = require("../models");

const createSubscription = async (subBody) => {
  const subscription = await Subscription.create(subBody);
  return subscription.toJSON();
};

const findSubscription = async (whereQuery, attributes = null) => {
  const subscription = await Subscription.findOne({ where: whereQuery, attributes });
  return subscription;
}


module.exports = {
  createSubscription,
  findSubscription,
}