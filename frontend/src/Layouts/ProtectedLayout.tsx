import { Link } from "react-router-dom";
import { useAppSelector } from "../app/redux/hook";
import { Lock } from "lucide-react";
import Unauthorzed from "../commonComponents/Unauthorzed";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  if (!user) return <Unauthorzed />;
  return <>{children}</>;
};

export default ProtectedLayout;
