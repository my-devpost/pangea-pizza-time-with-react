import express, { json } from 'express';
import cors from 'cors'; // Import the cors middleware
// import fetch from 'node-fetch';
import sql from '../config/sql.mjs';
import indexRouter from '../routes/index.route.mjs';
const app = express();
const port = 8080; // Choose a port for your server
app.use(cors());
app.use(json());

// const stripe = require('stripe')('sk_test_hRXesnlp0A2tjDoo7scD2ImL');
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_hRXesnlp0A2tjDoo7scD2ImL');
const YOUR_DOMAIN = process.env.REACT_APP_URL;

//routes
app.use("/", indexRouter)

///
app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/checkout-success?success=true`,
      cancel_url: `${YOUR_DOMAIN}/checkout-canceled?canceled=true`,
    });
  
    console.log(session.url, session, typeof session);
    res.redirect(303, session.url);
});

app.post('/create-checkout-session-2', async (req, res) => {
  const params = {
    submit_type: "pay",
    mode: "payment",
    payment_method_types: ["card"],
    billing_address_collection: "auto",
    // shipping_options: [{ shipping_rate: "shr_1Kn3IaEnylLNWUqj5rqhg9oV" }],
    line_items: req.body.map((item) => {
      const img = item.image[0].asset._ref;
      const newImage = img.replace("image-", "https://cdn.sanity.io/images/kyml1h03/production/").replace("-webp", ".webp");

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [newImage],
          },
          unit_amount: item.price * 100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    }),
    success_url: `${req.headers.origin}/checkout-success`,
    cancel_url: `${req.headers.origin}/checkout-cancelled`,
  };

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create(params);

  res.status(200).json(session);
});


app.post('/checkout-success', async (req, res) => {
    // log to server
});
app.post('/checkout-cancelled', async (req, res) => {
    // log to server
});
///

app.use(("*"), (req, res) => {
    res.send("404 - Not Found!")
})

sql.connect().then(() => {
    console.log('connected to database');
}).catch((err) => console.log(err.message))


app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
