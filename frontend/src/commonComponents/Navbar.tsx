import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useAppSelector } from "../app/redux/hook";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 z-50 w-full border-b py-2 border-border/40 bg-text backdrop-blur-xl"
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-10 ">
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
        <div className="hidden items-center gap-8 md:flex">
          {["Toys", "Bags"].map((link) => (
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
        <div className="flex items-center gap-3">
          {user ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/chat")}
              className="
            rounded-md
            bg-primary
            px-5
            py-2.5
            font-semibold
            text-background
            shadow-soft
            transition-all
            hover:bg-primary-light
          "
            >
              Start Shopping
            </motion.button>
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
  );
};

export default Navbar;
