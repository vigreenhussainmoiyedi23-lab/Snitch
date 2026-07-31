import { useEffect } from "react";
import { useProduct } from "../hook/useProduct";
import { useAppSelector } from "../../../app/redux/hook";

const Products = () => {
  const { GetAllProducts } = useProduct();
  useEffect(() => {
    GetAllProducts();
  }, []);
  const products = useAppSelector((state) => state.product.products);
  return <div></div>;
};

export default Products;
