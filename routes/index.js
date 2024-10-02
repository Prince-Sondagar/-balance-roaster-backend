const router = require('express').Router();

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const documentRoute = require('./document.route');
const subscriptiontRoute = require('./subscription.route ');


router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/document", documentRoute)
router.use("/subscription", subscriptiontRoute)


module.exports = router;