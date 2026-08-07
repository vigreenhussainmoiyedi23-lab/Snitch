import { useEffect } from "react";
import AppRoutes from "./app/routes";
import { useAuth } from "./features/auth/hooks/useAuth";
import { ToastContainer } from "react-toastify";
import { useProduct } from "./features/products/hook/useProduct";
import { useAppSelector } from "./app/redux/hook";
import { useCart } from "./features/cart/Hooks/useCart";
const App = () => {
  const { initializeAuth } = useAuth();
  const { GetAllEnumsHandler } = useProduct();
  const { GetCartHandler } = useCart();
  const user = useAppSelector((state) => state.auth.user);
  // all the things which i want only once when the app starts
  useEffect(() => {
    GetAllEnumsHandler();
    initializeAuth();
  }, []);
  
  useEffect(() => {
    GetCartHandler();
  }, [user]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
};

export default App;
