import { useAppSelector } from "../app/redux/hook";
import Unauthorzed from "../commonComponents/Unauthorzed";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  if (!user || user.role !== "admin") return <Unauthorzed />;
  return <>{children}</>;
};

export default AdminLayout;
