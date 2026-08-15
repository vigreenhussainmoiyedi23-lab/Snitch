import { Star } from "lucide-react";

const ReviewsSection = () => {
  return (
    <div className="mt-16 w-full bg-background-light py-20 px-4 border-t border-border/20">
      <div className="max-w-7xl mx-auto text-center mate text-text-subtle">
        <h3 className="eczar text-4xl mb-8 text-text">Customer Reviews</h3>
        <div className="bg-white/40 max-w-2xl mx-auto rounded-radius-lg p-12 border border-border/10 shadow-soft">
          <Star className="w-16 h-16 text-gold mx-auto mb-6 opacity-60" />
          <p className="text-xl mb-2 text-text">No reviews yet for this product.</p>
          <p className="text-base">Be the first to share your thoughts!</p>
          <button className="mt-8 bg-primary text-white teko text-xl px-8 py-2.5 rounded-radius-sm hover:bg-primary-dark transition-colors shadow-soft">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
