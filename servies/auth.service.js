const fs = require("fs").promises;
const ejs = require("ejs");
const sgMail = require("../utils/sgMail");
const { User } = require("../models");

const createUser = async (userBody) => {
  const userExit = await isValidUser({ email: userBody.email });
  if (userExit) throw new Error("Email is already exits!");
  const user = await User.create({ ...userBody });
  return user.toJSON();
};

const findUser = async (whereQuery, attributes = null) => {
  const user = await User.findOne({ where: whereQuery, attributes });
  if (!user) throw new Error("Your account doesn't exits!");
  return user.toJSON();
};

const isValidUser = async (whereQuery, attributes = null) => {
  const user = await User.findOne({ where: whereQuery, attributes });
  if (user) return true;
  return false;
};

const sendMail = async (email, portalUrl) => {
  const template = await fs.readFile("views/forgot-password.ejs", {
    encoding: "utf-8",
  });
  const compiledTemplate = ejs.compile(template)({ portalUrl });
  await sgMail.send({
    from: `Balance <${process.env.EMAIL}>`,
    to: email,
    subject: "Forgot Password link on Balance-Roster",
    html: compiledTemplate,
  });
};

const updateUser = async (id, userBody) => {
  const updatedUser = await User.update({ ...userBody }, { where: { id } });
  return updatedUser;
};

module.exports = {
  createUser,
  findUser,
  isValidUser,
  sendMail,
  updateUser,
};
