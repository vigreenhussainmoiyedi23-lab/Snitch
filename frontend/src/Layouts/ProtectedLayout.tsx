import { useAppSelector } from "../app/redux/hook";
import Unauthorzed from "../commonComponents/Unauthorzed";
import CartSideMenu from "../features/cart/components/CartSideMenu";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Unauthorzed />;
  return (
    <>
      <CartSideMenu isOpen={false} setIsOpen={() => {}} />
      {children}
    </>
  );
};

export default ProtectedLayout;
