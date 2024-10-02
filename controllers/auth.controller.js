const catchAsync = require("../utils/controllerErrorHandler");
const userService = require("../servies/auth.service");
const stripeService = require("../servies/stripe.service");
const {
  createTokenPair,
  createForgotPasswordTokenPair,
  verifyTokenPair,
} = require("../utils/JWTtokenHandler");
const { compare } = require("bcrypt");

const createUserController = catchAsync(async (req, res) => {
  try {
    const userBody = req.body;
    const user = await userService.createUser(userBody);
    const stripeCustomer = await stripeService.createCustomer({
      email: user.email,
      address: { country: "usa", line1: "xyz", line2: "xyz" },
      metadata: { userId: user.id },
    });

    let data = { stripe_id: stripeCustomer.id };

    await userService.updateUser(user.id, data);

    const requestedUser = await userService.findUser({ id: user.id });

    const tokens = createTokenPair(requestedUser);
    return res.status(200).json({
      error: false,
      message: "You have signup in successfully!",
      data: { user: user, token: tokens },
    });
  } catch (error) {
    throw Error(error);
  }
});

const loginUserController = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    const requestedUser = await userService.findUser({ email: email }, [
      "id",
      "firstname",
      "lastname",
      "email",
      "avatar",
      "password",
    ]);
    const isValidPassword = await compare(password, requestedUser.password);
    if (!isValidPassword)
      throw Error("Invalid password, try again with correct password");
    delete requestedUser.password;

    const tokens = createTokenPair(requestedUser);
    return res.status(200).json({
      error: false,
      message: "You have sign in successfully!",
      data: { user: requestedUser, token: tokens },
    });
  } catch (error) {
    throw Error(error);
  }
});

const forgotPasswordController = catchAsync(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.findUser({ email: email });
    const token = (await createForgotPasswordTokenPair(user))
      .forgotPasswordToken;
    const portalUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await userService.sendMail(email, portalUrl);
    return res.status(200).json({
      error: false,
      message:
        "An email has been sent to the address you provided if there is a user account associated with it",
    });
  } catch (error) {
    throw Error(error);
  }
});

const resetPasswordController = catchAsync(async (req, res) => {
  try {
    const { token, password } = req.body;
    const decodedToken = await verifyTokenPair(token);
    const { email, id } = decodedToken;
    const user = await userService.findUser({ id, email });
    if (!user) {
      throw Error("Invalid user or token");
    }
    await userService.updateUser(user.id, { password });
    return res
      .status(200)
      .json({ error: false, message: "Password reset successfully" });
  } catch (error) {
    throw Error(error);
  }
});

const updateUserController = catchAsync(async (req, res) => {
  try {
    const { id } = req.user;

    await userService.updateUser(id, req.body);

    const user = await userService.findUser({ id });
    return res.status(200).json({
      error: false,
      data: { user },
      message: "User updated successfully",
    });
  } catch (error) {
    throw Error(error);
  }
});
module.exports = {
  createUserController,
  loginUserController,
  forgotPasswordController,
  resetPasswordController,
  updateUserController,
};
