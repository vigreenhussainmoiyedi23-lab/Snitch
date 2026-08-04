import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/redux/hook";
import Loading from "../../../commonComponents/Loading";

const UpdateProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  if (!slug) return navigate("/products");
  const enums = useAppSelector((state) => state.product.enums) // includes the brands,categories,subCategories enums and admin can also create a new brand category subCategory
  const loading = useAppSelector((state) => state.product.loading);
  useEffect(() => {
    GetProductThroughSlug(slug);
  }, [slug]);
  if (loading) return <Loading subheading="Loading Product Details..." />
  const slugProduct = useAppSelector((state) => state.product.slugProduct);
  if (!slugProduct) return <Loading subheading="Product Not Found..." />
  const {
    UpdateProductsPatchHandler, // accepts (id,data) id=slugProduct._id data will have images and keep array keep is array of fileIds 
    UpdateProductsPutHandler,  // accepts (id,data)  id=slugProduct._id
    GetProductThroughSlug,
  } = useProduct();

  const [keep, setKeep] = useState([]);
  return (
    <div>
      {/* Images section At top */}

      {/* All Other Updates At Below */}
    </div>
  );
};

export default UpdateProducts;
