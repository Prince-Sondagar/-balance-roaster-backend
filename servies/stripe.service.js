const { stripeConnection } = require('../utils/stripeConnection');
const { stripeSecretKey } = require('../config');
const { default: Stripe } = require('stripe');

const stripeClient = () => new Stripe(stripeSecretKey)


const createCustomer = async (requestedCustomer) => {
    const stripeClient = new Stripe(stripeSecretKey)
    const customer = await stripeClient.customers.create(requestedCustomer);
    return customer;

}

const createPaymentIntent = async (user, body) => {
    const stripeClient = new Stripe(stripeSecretKey)
    const payment = await stripeClient.paymentIntents.create({
        amount: body.price.unit_amount,
        payment_method_types: ["card"],
        description: "Monthly billing purchase",
        currency: "usd",
        customer: user.stripe_id,
        metadata: {
            userId: user.id,
            customerId: user.stripe_id,
            priceId: body.default_price,
            productId: body.id,
            type: body.type,
        }
    });
    return payment.client_secret
}

const createSubscription = async (stripeCustomerId, stripePriceId) => {
    const stripeClient = new Stripe(stripeSecretKey)
    const newSubscription = await stripeClient.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: stripePriceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: { customerId: stripeCustomerId },
    });
    return newSubscription;
}

const validateWebhookSignature = (requestBody, signature, endpointSecret) => {
    const header = stripeClient.webhooks.generateTestHeaderString({
        payload: requestBody,
        secret: endpointSecret,
    });

    return this.stripeClient.webhooks.constructEvent(requestBody, header, endpointSecret);
}

const userSubscriptionsHook = async (body) => {
    try {
        const { type, data } = body;
        switch (type) {
            case "customer.subscription.updated":
                const previous_attributes = data.previous_attributes;
                const subscriptionUpdate = data.object;
                if (!(previous_attributes?.status === "incomplete" && subscriptionUpdate?.status === "active")) return null;
                const user = await this.userService.findOne({ stripeUserId: subscriptionUpdate.metadata.customerId });

                if (!user) return null;
                const subscriptionPlanForUpdate = await this.subscriptionsPlan.findOne({
                    where: { stripePriceId: subscriptionUpdate.plan.id },
                });
                await this.userSubscriptionService.create(subscriptionUpdate, subscriptionPlanForUpdate, user);
                break;
            case "customer.subscription.deleted":
                const subscriptionDeleted = data.object;
                if (subscriptionDeleted.status !== "canceled") return null;
                await this.userSubscriptionService.delete(subscriptionDeleted);
                break;

            default:
                break;
        }
    } catch (error) {
        console.log("error:-", error);
    }
}


module.exports = { createCustomer, createPaymentIntent, createSubscription, validateWebhookSignature, userSubscriptionsHook }