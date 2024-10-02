const catchAsync = require("../utils/controllerErrorHandler");
const userService = require("../servies/user.service");
const subscriptionService = require('../servies/subscription.service')

const getUserController = catchAsync(async (req, res) => {
  try {
    const { id } = req.user;
    const user = await userService.getUser({ id: id }, [
      "id",
      "firstname",
      "lastname",
      "email",
      "avatar",
      "stripe_id",
    ])
    const subscription = await subscriptionService.findSubscription({ userId: id, status: false })
    return res.status(201).json({ error: false, data: { ...user, subscription: subscription } });
  } catch (error) {
    throw Error(error);
  }
});

module.exports = {
  getUserController,
};
