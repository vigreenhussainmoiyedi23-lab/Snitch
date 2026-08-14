import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

const ProductFeatures = () => {
  const features = [
    {
      icon: Truck,
      title: "Free Worldwide Shipping",
      desc: "On all orders over ₹2000",
    },
    {
      icon: ShieldCheck,
      title: "1 Year Warranty",
      desc: "Covered by our guarantee",
    },
    {
      icon: RotateCcw,
      title: "30 Days Return",
      desc: "No questions asked",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      desc: "100% encrypted payment",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
      {features.map((feat, idx) => (
        <div
          key={idx}
          className="flex gap-3 items-start p-3 rounded-radius-md hover:bg-white/70 hover:border border-border transition-colors group"
        >
          <div className="p-2 bg-white group-hover:bg-background text-primary rounded-full shadow-soft shrink-0 transition-colors">
            <feat.icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="mate font-semibold text-text text-sm">
              {feat.title}
            </h4>
            <p className="text-text-subtle text-xs mt-0.5">
              {feat.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductFeatures;
