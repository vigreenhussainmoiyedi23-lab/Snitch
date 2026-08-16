import { useAppSelector } from "../../../app/redux/hook";
import type { OptionItem } from "../../admin/components/CreateProduct/types";
import { useVariant } from "../hooks/useVariant";

type Params = {
  options: OptionItem[];
};

const BrowseAndSelectVariant = ({ options }: Params) => {
    const variants = useAppSelector((state) => state.variant.variants);
    console.log(options,variants);

  return <div></div>;
};

export default BrowseAndSelectVariant;
