import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, ShoppingCart } from "lucide-react";
import { useAppSelector } from "../app/redux/hook";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { useState } from "react";
import CartSideMenu from "../features/cart/components/CartSideMenu";

const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  
  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 w-full border-b py-2 border-border/40 bg-text backdrop-blur-xl"
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-evenly px-6 lg:px-10 ">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-3"
          >
            <Logo size={"3"} />
            <span
              className="text-2xl font-bold text-background tracking-[0.2em] uppercase"
              style={{ fontFamily: "system-ui" }}
            >
              Stitch
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {["About", "Contact", "Orders"].map((link) => (
              <a
                key={link}
                href={`/${link.toLowerCase().replace(/ /g, "-")}`}
                className="
            relative
            text-sm
            font-medium
            text-background-light
            transition-all
            duration-300
            hover:text-primary

            after:absolute
            after:left-0
            after:-bottom-1
            after:h-0.5
            after:w-0
            after:bg-primary
            after:transition-all
            after:duration-300
            hover:after:w-full
          "
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex  items-center gap-3">
            {user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/products")}
                  className="
              rounded-md
              bg-primary
              px-5
              py-2.5
              font-semibold
              text-background
              shadow-soft
              transition-all
                  hover:bg-background
              hover:text-primary
              flex gap-2 items-center
              "
                >
                  <ShoppingBag className="w-6 h-6" />{" "}
                  <span className="">Shop Now</span>
                </motion.button>

                {user.role === "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/admin")}
                    className="
              rounded-md
              bg-background
              px-5
              py-2.5
              font-semibold
              text-primary
              shadow-soft
              transition-all
              hover:bg-primary-light
              hover:text-background
              "
                  >
                    DashBoard
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="
                 
              rounded-md
              bg-primary
              px-5
              py-2.5
              font-semibold
              text-background
              shadow-soft
              transition-all
             hover:bg-background
              hover:text-primary
              flex gap-2 items-center relative
              "
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItems.length > 0 && (
                    <span className="bg-red-500 w-6 h-6  rounded-full absolute -top-1/2 right-0 translate-y-1/2">
                      {cartItems.length}
                    </span>
                  )}
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/login")}
                  className="
              rounded-md
              border
              border-border
              bg-surface
              px-5
              py-2.5
              font-medium
              text-background
              transition-all
              hover:border-primary
              hover:bg-surface-2
            "
                >
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/register")}
                  className="
              flex
              items-center
              gap-2
              rounded-md
              bg-background
              px-5
              py-2.5
              font-semibold
              text-text
              shadow-soft
              transition-all
              hover:bg-text-muted
            "
                >
                  Get Started
                  <ChevronRight size={16} />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.nav>
      <CartSideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Navbar;
