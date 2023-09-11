import { Router } from "express";
import { createCheckoutSession, callback } from "../controllers/stripe.controller.mjs";

const stripeRouter = Router();

stripeRouter.post('/create-checkout-session', createCheckoutSession);
stripeRouter.post('/', callback);   // success or canceled
stripeRouter.get('/', callback);   // success or canceled

export default stripeRouter;