import usePayment from "../hooks/usePayment";

function PaymentButton({ totalAmount = 0 }) {
  const { handlePayment } = usePayment();
  return (
    <button
      onClick={(e)=>{
        e.preventDefault();
        handlePayment()
      }}
      className="w-full flex items-center justify-center gap-2 bg-primary text-background hover:bg-primary-dark px-4 py-4 rounded-lg shadow-[var(--shadow-medium)] transition-all active:scale-[0.98]"
    >
      Pay Now {totalAmount > 0 && <span>₹{totalAmount.toFixed(2)}</span>}
    </button>
  );
}

export default PaymentButton;
