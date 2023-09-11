// const stripe = require('stripe')('sk_test_hRXesnlp0A2tjDoo7scD2ImL');
import Stripe from 'stripe';
import * as Pangea from "../lib/pangea.mjs";

const vaultToken = process.env.PANGEA_VAULT_TOKEN;
const pangeaDomain = process.env.PANGEA_DOMAIN;
const vault = Pangea.vault(vaultToken, pangeaDomain);
const auditID = process.env.PANGEA_AUDIT_TOKEN_ID;
const stripeID = process.env.PANGEA_STRIPE_ID;
const audit = await Pangea.audit(vault, auditID, pangeaDomain);
const stripeSecret = await Pangea.getVaultItem(vault, stripeID, pangeaDomain);

const stripe = new Stripe(stripeSecret);
const YOUR_DOMAIN = process.env.REACT_APP_STRIPE_URL;

export const createCheckoutSession= (line_items, totalPrice, totalQuantity, totalTax) => {
    return new Promise( async (resolve, reject) => {

        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            billing_address_collection: "auto",
            // shipping_options: [{ shipping_rate: "shr_1Kn3IaEnylLNWUqj5rqhg9oV" }],
            line_items: line_items.map((item) => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                };
            }),
            // success_url: 'http://18.143.238.124:8080/stripe',
            success_url: 'http://18.143.238.124:3000/payment2?success=true',
            cancel_url: 'http://18.143.238.124:3000/payment?cancel=true',
            // success_url: `${YOUR_DOMAIN}?success=true`,
            // cancel_url: `${YOUR_DOMAIN}/canceled=true`,
        }

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create(params);

        resolve(session)

    })   // promise
}

