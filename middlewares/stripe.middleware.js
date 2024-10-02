const { stripeConnection } = require('../utils/stripeConnection');
const {stripeSecretKey}=  require('../config')

const stripeAuthMiddleware = async (req, res, next) => {
    try {
     

        // const admin = await AdminService.findAdmin({ _id });

        const key = stripeSecretKey;
        if (key === undefined) return res.status(400).json({ status: false, message: "Stripe key not exist , Please update stripe key" });

        req.stripe = await stripeConnection(key);
        next()

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
};

module.exports = stripeAuthMiddleware;