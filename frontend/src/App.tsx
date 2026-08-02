import { useEffect } from "react";
import AppRoutes from "./app/routes";
import { useAuth } from "./features/auth/hooks/useAuth";
import { ToastContainer } from "react-toastify";
import { useProduct } from "./features/products/hook/useProduct";
const App = () => {
  const { initializeAuth } = useAuth();
  const { GetAllEnumsHandler } = useProduct();
  // all the things which i want only once when the app starts
  useEffect(() => {
    GetAllEnumsHandler();
    initializeAuth();
  }, []);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
};

export default App;
