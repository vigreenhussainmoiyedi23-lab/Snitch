interface ProductSpecsProps {
  brand?: string;
  category?: string;
  attributes?: Record<string, any>;
}

const ProductSpecs = ({ brand, category, attributes }: ProductSpecsProps) => {
  return (
    <div className="mb-12">
      <h3 className="eczar text-3xl mb-6 text-text border-b border-border/30 pb-3">Specifications</h3>
      <div className="bg-white/50 rounded-radius-md p-6 border border-border/20 shadow-soft">
        <table className="w-full text-left border-collapse mate text-lg">
          <tbody>
            <tr className="border-b border-border/20 last:border-0">
              <th className="py-4 font-semibold text-text w-1/3">
                Brand
              </th>
              <td className="py-4 text-text-subtle capitalize">
                {brand}
              </td>
            </tr>
            <tr className="border-b border-border/20 last:border-0">
              <th className="py-4 font-semibold text-text w-1/3">
                Category
              </th>
              <td className="py-4 text-text-subtle capitalize">
                {category}
              </td>
            </tr>
            {attributes &&
              Object.entries(attributes).map(([k, v]) => (
                <tr key={k} className="border-b border-border/20 last:border-0">
                  <th className="py-4 font-semibold text-text w-1/3 capitalize">
                    {k}
                  </th>
                  <td className="py-4 text-text-subtle capitalize">
                    {v as string}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSpecs;
