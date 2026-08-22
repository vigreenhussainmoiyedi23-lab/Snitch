import { useCart } from "../../cart/Hooks/useCart";
import { CreateOrderApi, verifyPaymentApi } from "../service/api.service";

const usePayment = () => {
  const {GetCartHandler}=useCart()
  const handlePayment =async () => {
    try {
      console.count("🔥 handlePayment called");
      const order = await CreateOrderApi();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "STICTH",
        description: `Payment for order ${order.id}` ,
        order_id: order.id,
        handler: async function (response: any) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          try {
            const data = {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              signature: razorpay_signature,
            };
            await verifyPaymentApi(data);
            await GetCartHandler()
            alert("Payment successful!");
          } catch (err) {
            alert("Payment verification failed!");
          }
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
  return { handlePayment };
};

export default usePayment;
