import React from "react";
import { useState, useEffect } from "react";
import { FaShippingFast } from "react-icons/fa";
import { RiShoppingBagLine } from "react-icons/ri";
import ResetLocation from "../../helpers/ResetLocation";
import { Link, useNavigate } from "react-router-dom";

const CheckoutForm = ({ currentUser, toggleDelivery, togglePromocode, promoCode, totalPayment, productsQuantity, taxes, lineItems }) => {
  const [formValue, setFormValue] = useState({
    fullname: currentUser.fullname, email: currentUser.email, address: currentUser.address, number: currentUser.number, chooseDelivery: "", promoCode: ''
  });
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(validateForm(formValue));
    setSubmit(true);
    ResetLocation();
  }
  
  const createCheckoutSession = async () => {
    // post to stripe create checkout session route

    const data = {
      user: currentUser,
      line_items: lineItems,
      totalPrice: totalPayment,
      totalQuantity: productsQuantity,
      totalTax: taxes
    }

    const response = await fetch(`${process.env.REACT_APP_STRIPE_URL}/create-checkout-session`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json"
      }
    });

    const json = await response.json();

    console.log('create checkout session response >>> ', json, typeof json);
    return json;

  }

  useEffect( () => {
    console.log('form error keys, submit pressed >>> ', Object.keys(formError), submit)
    if (submit && Object.keys(formError).length === 0) {
  
      // return navigate('/payment');
      // return navigate('/payment2');


      (async () => {
        const session = await createCheckoutSession();
        console.log('session >>> ', session);
        window.location.replace(session.url);
      })();


      // const timeout = setTimeout(() => {
      //   // 👇️ redirects to an external URL
      //   window.location.replace('https://xpay.my');
      // }, 3000);
  
      // return () => clearTimeout(timeout);

      // return navigate(`${process.env.REACT_APP_URL}/create-checkout-session`);
    }

  }, [submit, formError, navigate]);


  const handleValidation = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  }
  const validateForm = (value) => {
    let errors = {}
    // if (value.address === null) {
    //   errors.address = "Please add an address"
    // }
    // if (value.number === null) {
    //   errors.number = "Missing a phone number"
    // }
    if (!value.chooseDelivery) {
      errors.chooseDelivery = "Please choose a delivery type"
    }
    if (!value.promoCode && promoCode) {
      errors.promoCode = "Please indicate your promo code"
    }
    if (value.promoCode && value.promoCode.length < 5 && promoCode) {
      errors.promoCode = "Invalid promo code!"
    }

    return errors;
  }

  return (
    <section className="checkout-personal-information">
      <h3>Personal information <span><Link onClick={ResetLocation} to="/profile">Edit profile</Link></span></h3>
      <section>
        <p>{currentUser.fullname}</p>
        <p>{currentUser.email}</p>
        {currentUser.address !== null ?
          <p>{currentUser.address}</p> :
          <p className="checkout-address">You haven't added address yet<span><Link onClick={ResetLocation} to="/profile">Add address</Link></span></p>}
        <span className="fullname-error-cpage">{formError.address}</span>
        {currentUser.number !== null ?
          <p>{currentUser.number}</p> :
          <p className="checkout-number">Please add you contact number<span><Link onClick={ResetLocation} to="/profile">Add number</Link></span></p>}
        <span className="fullname-error-cpage">{formError.number}</span>
      </section>
      <form onSubmit={handleSubmit}>
        <h3>Delivery details</h3>
        <label htmlFor="takeaway" className="takeaway-option" name="chooseDelivery">
          <RiShoppingBagLine />
          Takeaway
          <input
            onClick={toggleDelivery}
            className="takeaway"
            type="radio"
            placeholder="Address"
            value="takeaway"
            name="chooseDelivery"
            onChange={handleValidation}
          />
        </label>
        <label htmlFor="delivery" className="delivery-option" name="chooseDelivery">
          <FaShippingFast />
          Delivery
          <input
            onClick={toggleDelivery}
            className="delivery"
            type="radio"
            placeholder="Address"
            value="delivery"
            name="chooseDelivery"
            onChange={handleValidation}
          />
        </label>
        <span className="fullname-error-cpage">{formError.chooseDelivery}</span>
        <section className="promo-code">

          {promoCode === false ? <p onClick={togglePromocode}>I have a promo code!</p> : (
            <React.Fragment>
              <p onClick={togglePromocode}>No promo code</p>
              <input
                name="promoCode"
                className=" pop-font"
                type="text"
                placeholder="Enter the 5-digit code"
                onChange={handleValidation}
                value={formValue.promoCode}
              />
            </React.Fragment>
          )}
          <span className="fullname-error-cpage">{formError.promoCode}</span>
        </section>
        <article className="checkout-carttotals">
          {productsQuantity === 0 ? null : (
            <section className="cart-totals">
              <section className="totals-content">
                <h4 className="cart-totals-sum">Tax 0%:</h4>
                <p>$ {taxes}</p>
              </section>
              <section className="totals-content">
                <h4 className="cart-totals-sum">Quantity:</h4>
                <p> {productsQuantity}</p>
              </section>
              <section className="totals-content" >
                <h4 className="cart-totals-sum">Total:</h4>
                {/* COUNTING TWICE DUE TO STRICT MODE */}
                <p>$ {totalPayment.toFixed(2)}</p>
              </section>
            </section>

          )}
        </article>
        <button type="submit" className="active-button-style">
          Proceed to payment
        </button>
      </form>
    </section>
  );
}


export default CheckoutForm;
