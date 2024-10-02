const { User } = require("../models");

const getUser = async (whereQuery, attributes = null) => {
    const user = await User.findOne({ where: whereQuery, attributes });
    return user.toJSON();
}

module.exports = {
    getUser,
};