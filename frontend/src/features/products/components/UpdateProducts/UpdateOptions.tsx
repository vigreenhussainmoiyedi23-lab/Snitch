import Loading from "../../../../commonComponents/Loading";
import { useProduct } from "../../hook/useProduct";
type Props = {
  productId: string;
};
const UpdateOptions = ({ productId }:Props) => {
  if (!productId) return <Loading />; // or a good loading screen for this component;
  const { UpdateProductOptionsHandler } = useProduct();
  return <div></div>;
};

export default UpdateOptions;
