import { useAppSelector } from "../../../app/redux/hook";
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import { Link } from 'react-router-dom';
import { ChevronLeft, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import PaymentButton from "../../payment/component/PayButton";

const Checkout = () => {
  const { cartItems, totalAmount } = useAppSelector((state) => state.cart);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-28 h-28 bg-background-subtle border border-border rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-soft)]">
          <Lock className="w-10 h-10 text-text-subtle" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-semibold text-text mb-3 tracking-wide">Checkout Unavailable</h2>
        <p className="text-text-subtle mb-8 max-w-sm text-base leading-relaxed">Your cart is currently empty. Please add some of our premium products to proceed.</p>
        <Link 
          to="/products"
          className="flex items-center justify-center gap-2 bg-primary text-background hover:bg-primary-dark px-8 py-3.5 rounded-[var(--radius-md)] shadow-[var(--shadow-medium)] transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary group"
        >
          <span className="font-medium tracking-wide">Return to Shop</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-8 lg:mb-12">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-text-muted hover:text-text transition-colors flex items-center gap-1 group text-sm font-medium">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
          <span className="text-text-subtle">/</span>
          <span className="font-semibold text-text text-sm tracking-wide">Secure Checkout</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[var(--color-success)] text-sm font-medium bg-[var(--color-success)]/10 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>SSL Encrypted</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Main Content - Checkout Form */}
        <div className="w-full lg:flex-[3]">
          <h1 className="text-3xl font-semibold text-text mb-8 tracking-wide">Shipping Information</h1>
          
          <form className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Contact */}
            <div className="bg-background-light p-6 md:p-8 rounded-lg shadow-[var(--shadow-soft)] border border-border space-y-6 transition-shadow hover:shadow-[var(--shadow-medium)]">
              <h2 className="text-xl font-semibold text-text mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-background text-xs flex items-center justify-center font-bold">1</span>
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-text-muted">Full Name</label>
                  <input type="text" id="name" placeholder="John Doe" className="w-full px-4 py-3 bg-background border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-subtle text-text" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-text-muted">Phone Number</label>
                  <input type="tel" id="phone" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-background border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-subtle text-text" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-background-light p-6 md:p-8 rounded-lg shadow-[var(--shadow-soft)] border border-border space-y-6 transition-shadow hover:shadow-[var(--shadow-medium)]">
              <h2 className="text-xl font-semibold text-text mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-background text-xs flex items-center justify-center font-bold">2</span>
                Shipping Address
              </h2>
              <div className="space-y-6 pt-2">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-text-muted">Street Address</label>
                  <input type="text" id="address" placeholder="123 Luxury Avenue, Suite 100" className="w-full px-4 py-3 bg-background border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-subtle text-text" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium text-text-muted">City</label>
                    <input type="text" id="city" placeholder="New York" className="w-full px-4 py-3 bg-background border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-subtle text-text" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium text-text-muted">State</label>
                    <input type="text" id="state" placeholder="NY" className="w-full px-4 py-3 bg-background border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-subtle text-text" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pincode" className="text-sm font-medium text-text-muted">ZIP / Pincode</label>
                    <input type="text" id="pincode" placeholder="10001" className="w-full px-4 py-3 bg-background border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-subtle text-text" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Checkout Button (Sticky) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-50 animate-in slide-in-from-bottom duration-500">
              <PaymentButton totalAmount={totalAmount} />
            </div>
            
            {/* Desktop Checkout Button */}
            <div className="hidden lg:block pt-4">
            <PaymentButton totalAmount={totalAmount} />
            </div>
          </form>
        </div>

        {/* Sidebar - Cart Summary & Items */}
        <div className="w-full lg:flex-2 lg:sticky lg:top-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="bg-background-light p-6 md:p-8 rounded-lg shadow-[var(--shadow-soft)] border border-border">
            <h2 className="text-xl font-semibold text-text mb-6 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-sm font-normal text-text-muted bg-background-subtle px-3 py-1 rounded-full">{itemCount} items</span>
            </h2>
            
            <div className="flex flex-col gap-2 max-h-87.5 overflow-y-auto pr-2 pb-6 border-b border-border mb-6 custom-scrollbar scroll-smooth">
              {cartItems.map((item, i) => (
                <div key={item.product._id} className="animate-in slide-in-from-right-8 duration-500" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                  <CartItem item={item} />
                </div>
              ))}
            </div>
            
            <CartSummary totalAmount={totalAmount} isCheckoutPage={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
