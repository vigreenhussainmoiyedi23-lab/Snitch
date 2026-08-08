import axios from "axios";

function PaymentButton({ totalAmount = 0 }) {
  const handlePayment = async (e: any) => {
    try {
        e.preventDefault()
      console.log("Key",import.meta.env.VITE_RAZORPAY_API_KEY)
      // Step 1: Create order on backend

      const order = (
        await axios.post("http://localhost:3000/api/payment/create", {
          amount: totalAmount || 100, // Amount in INR
        })
      ).data;
   
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY, // from .env (frontend can use only key_id)
        amount: order.amount,
        currency: order.currency,
        name: "My Company",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response: any) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          try {
            await axios.post("http://localhost:3000/api/payment/verify", {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              signature: razorpay_signature,
            });
            alert("Payment successful!");
          } catch (err) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full flex items-center justify-center gap-2 bg-primary text-background hover:bg-primary-dark px-4 py-4 rounded-lg shadow-[var(--shadow-medium)] transition-all active:scale-[0.98]"
    >
      Pay Now
    </button>
  );
}

export default PaymentButton;
