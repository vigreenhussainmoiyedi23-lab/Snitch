import usePayment from "../hooks/usePayment";

function PaymentButton({ totalAmount = 0 }) {
  const { handlePayment } = usePayment();
  const shipping = totalAmount < 1500 ? 100 : 0;
  const finalAmount = (totalAmount + shipping) * 1.18;
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handlePayment();
      }}
      className="w-full flex items-center justify-center gap-2 bg-primary text-background hover:bg-primary-dark px-4 py-4 rounded-lg shadow-[var(--shadow-medium)] transition-all active:scale-[0.98]"
    >
      Pay Now {finalAmount > 0 && <span>₹{finalAmount.toFixed(2)}</span>}
    </button>
  );
}

export default PaymentButton;
