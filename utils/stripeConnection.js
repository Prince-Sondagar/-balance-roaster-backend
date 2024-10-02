const Stripe = require('stripe');


async function stripeConnection(stripeSecretKey) {
    const stripe = Stripe(stripeSecretKey)
    return stripe
}


module.exports = { stripeConnection };