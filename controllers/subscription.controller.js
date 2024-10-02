const catchAsync = require("../utils/controllerErrorHandler");
const subscriptionService = require('../servies/subscription.service');
const stripeService = require('../servies/stripe.service');
const { updatedDate } = require("../utils");


const createSubscription = async (stripeCustomerId, stripePriceId) => {
    const newSubscription = await stripeService.createSubscription(stripeCustomerId, stripePriceId);
    return {
        subscriptionId: newSubscription.id,
        clientSecret: ((newSubscription.latest_invoice)?.payment_intent)
            ?.client_secret,
        paymentInvoice: (newSubscription?.latest_invoice)?.id,
    };
}


const createSubscriptionController = catchAsync(async (req, res) => {
    try {
        const { id, stripe_id } = req.user
        const { default_price } = req.body
        const { startDate, endDate } = updatedDate()

        // let abc = await createSubscription(stripe_id, default_price)

        const paymentIntent = await stripeService.createPaymentIntent(req.user, req.body);
        // const subscription = await subscriptionService.createSubscription(updatedSubBody);d ..
        

        return res.status(200).json({
            error: false,
            message: "You have created successfully!",
            data: {clientSecret:paymentIntent},
        });
    } catch (error) {
        throw Error(error);
    }
});
const fetchAllStripeProduct = async (req, res) => {
    try {
        const stripe = req.stripe
        const products = await stripe.products.list();
        const prices = await stripe.prices.list();

        products.data.forEach(product => {
            console.log(`Product: ${product.name}`);
            const productPrices = prices.data.filter(price => price.product === product.id);
            product.price = productPrices[0]
            productPrices.forEach(price => {
                console.log(`  Price: ${price.unit_amount} ${price.currency}`);
            });
        })

        res.status(200).json({
            error: false,
            message: "subscription plan fetched successfully!",
            data: products.data
        });

    } catch (error) {
        throw Error(error);
    }
}




module.exports = {
    createSubscriptionController,
    fetchAllStripeProduct

};