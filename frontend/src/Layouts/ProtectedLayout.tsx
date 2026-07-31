
import { useAppSelector } from "../app/redux/hook";
import Unauthorzed from "../commonComponents/Unauthorzed";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  if (!user) return <Unauthorzed />;
  return <>{children}</>;
};

export default ProtectedLayout;
