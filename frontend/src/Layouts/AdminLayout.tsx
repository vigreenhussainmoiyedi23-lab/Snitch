import { useAppSelector } from "../app/redux/hook";
import Unauthorzed from "../commonComponents/Unauthorzed";

const AdminLayout = ({
  children,
  shouldHaveNavbar = false,
}: {
  children: React.ReactNode;
  shouldHaveNavbar?: boolean;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  if (!user || user.role !== "admin") return <Unauthorzed />;
  if (!shouldHaveNavbar) return <>{children}</>;

  return <>{children}</>;
};

export default AdminLayout;
