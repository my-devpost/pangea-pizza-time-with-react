
import * as stripeServices from "../services/stripe.service.mjs"
import * as Pangea from "../lib/pangea.mjs";


const vaultToken = process.env.PANGEA_VAULT_TOKEN;
const pangeaDomain = process.env.PANGEA_DOMAIN;
const vault = Pangea.vault(vaultToken, pangeaDomain);
const auditID = process.env.PANGEA_AUDIT_TOKEN_ID;
const audit = await Pangea.audit(vault, auditID, pangeaDomain);

export const createCheckoutSession = (req, res) => {
    const { user, line_items, totalPrice, totalQuantity, totalTax } = req.body;
    console.log('line items >>> ', line_items);

    stripeServices.createCheckoutSession(line_items, totalPrice, totalQuantity, totalTax)
        .then( async (session) => {
            console.log('session >>> ', session.url, session.success_url, session.cancel_url, typeof session);
            
            const option = {
                verbose: true
            };
            const logResponse = await audit.log({
            actor: user.email,
            action: "Create checkout session",
            status: "Success",
            target:`${Pangea.hostIpAddress(req)}`,
            source:`${Pangea.clientIpAddress(req)}`,
            message: `User '${user.email}' created checkout session with total amount $${totalPrice} and quantity ${totalQuantity}`,
            }, option);
            console.log("Response: %s", logResponse.result);


            res.status(200).json( {
                message: 'checkout session created',
                url: session.url,
                success_url: session.success_url
            });

            // res.redirect(303, session.url);

        }).catch((err) => {
    	    console.log('create checkout session err >>> ', err);
            res.status(500).send(err)
        })
};

export const callback = (req, res) => {
    res.status(200).json(req.body);
}
