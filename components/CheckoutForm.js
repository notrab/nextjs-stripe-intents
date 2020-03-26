import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { destroyCookie } from "nookies";

const CheckoutForm = ({ paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutError, setCheckoutError] = useState();
  const [checkoutSuccess, setCheckoutSuccess] = useState();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const {
        error,
        paymentIntent: { status }
      } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (error) throw new Error(error.message);

      if (status === "succeeded") {
        destroyCookie(null, "paymentIntentId");
        setCheckoutSuccess(true);
      }
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  if (checkoutSuccess) return <p>Payment successfull!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />

      <button type="submit" disabled={!stripe}>
        Pay now
      </button>

      {checkoutError && <span style={{ color: "red" }}>{checkoutError}</span>}
    </form>
  );
};

export default CheckoutForm;
