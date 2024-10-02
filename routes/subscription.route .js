const router = require('express').Router();
const { createSubscriptionController, fetchAllStripeProduct } = require("../controllers/subscription.controller");
const userAuthMiddleware = require('../middlewares/auth.middleware');
const stripeAuthMiddleware = require('../middlewares/stripe.middleware');


router.post("/create", userAuthMiddleware,stripeAuthMiddleware, createSubscriptionController);

router.get("/all", stripeAuthMiddleware, fetchAllStripeProduct);



module.exports = router;