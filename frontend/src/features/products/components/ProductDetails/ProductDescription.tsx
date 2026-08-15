interface ProductDescriptionProps {
  description?: string;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <div className="mb-12">
      <h3 className="eczar text-3xl mb-4 text-text">Product Description</h3>
      <div className="mate text-text-subtle leading-relaxed text-lg bg-white/30 p-6 rounded-radius-md border border-border/10">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ProductDescription;
