import EmptyCart from "../cart/EmptyCart.js";
import React, { useEffect, useState } from "react";
import Tick from "../../assets/images/success-tick.png";
import ResetLocation from "../../helpers/ResetLocation";
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import validateForm from "../../components/validateForm";
const Payment2 = ({ cartItems, totalPayment }) => {

  const [formValue, setFormValue] = useState({ firstname: '', lastname: '', cardNumber: "", cvv: '', month: '', year: '' });
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState({});
  const [transactionId, setTransactionId] = useState(0);
  const validate = validateForm("payment");

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(validate(formValue));
    setSubmit(true);
    setTransactionId(uuidv4());
    ResetLocation();
  }

  const handleValidation = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  }

  useEffect(() => {
    document.title = "Payment | Pizza Time";
  }, []);
  return (
    <React.Fragment>
      {cartItems.length === 0 ? <EmptyCart /> :
        <main>
          {submit && Object.keys(formError).length === 0 ?
            <article className="success-payment">
              <section className="success-payment-title">
                <h2>Your food is on the way!</h2>
                <p>Thank you for the order. We will update your order status once the restaurant confirms it. </p>
              </section>
              <img src={Tick} alt="" aria-hidden="true" />
              <section className="payment-details">
                <p>Amount paid: <span>{totalPayment} $</span></p>
                <p>Transaction id: <span>{transactionId}</span></p>
                <h3>Est. delivery time: 24mins.</h3>
              </section>
              <section className="success-payment-redirection">
                <Link className="active-button-style" to="/order" onClick={ResetLocation}>Track my order</Link>
                <Link to="/menu" onClick={ResetLocation}>Order something else</Link>
              </section>
            </article> :
            <article className="success-payment">
              <section className="success-payment-title">
                <h2>Your food is on the way!</h2>
                <p>Thank you for the order. We will update your order status once the restaurant confirms it. </p>
              </section>
              <img src={Tick} alt="" aria-hidden="true" />
              <section className="payment-details">
                <p>Amount paid: <span>{totalPayment} $</span></p>
                <p>Transaction id: <span>{transactionId}</span></p>
                <h3>Est. delivery time: 24mins.</h3>
              </section>
              <section className="success-payment-redirection">
                <Link className="active-button-style" to="/order" onClick={ResetLocation}>Track my order</Link>
                <Link to="/menu" onClick={ResetLocation}>Order something else</Link>
              </section>
            </article>}
        </main>
      }
    </React.Fragment>
  );
}


export default Payment2;
