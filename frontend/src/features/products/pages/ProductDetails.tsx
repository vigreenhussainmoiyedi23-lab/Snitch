import { useParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useEffect } from "react";
import { useAppSelector } from "../../../app/redux/hook";
import Loading from "../../../commonComponents/Loading";

const ProductDetails = () => {
  const { slug } = useParams();
  const { GetProductThroughSlug } = useProduct();
  const slugProduct = useAppSelector((state) => state.product.slugProduct);
  const loading = useAppSelector((state) => state.product.loading);
  if (!slug) {
    return null;
  }
  useEffect(() => {
    GetProductThroughSlug(slug);
  }, [slug]);
  if (loading) return <Loading subheading="Loading Product" />;
  if (!slugProduct) return <div>{JSON.stringify(slugProduct)}</div>;
};

export default ProductDetails;
