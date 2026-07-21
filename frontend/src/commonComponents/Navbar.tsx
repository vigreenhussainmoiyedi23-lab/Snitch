import { motion } from "framer-motion";
import { Zap, Swords, ChevronRight } from "lucide-react";
import { useAppSelector } from "../app/redux/hook";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  return (
    <motion.nav
      className="lp-nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="lp-nav-inner">
        <div className="lp-logo" onClick={() => navigate("/")}>
          <div className="lp-logo-icon">
            <Zap size={18} />
          </div>
          <span className="lp-logo-text">Snitch</span>
        </div>
        <div className="lp-nav-links">
          {["Features", "How It Works"].map((l) => (
            <a
              key={l}
              className="lp-nav-link"
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="lp-nav-cta">
          {user ? (
            <motion.button
              className="lp-btn lp-btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/chat")}
            >
              <Swords size={15} /> Go to Arena
            </motion.button>
          ) : (
            <>
              <motion.button
                className="lp-btn lp-btn-ghost"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
              >
                Login
              </motion.button>
              <motion.button
                className="lp-btn lp-btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
              >
                Get Started <ChevronRight size={15} />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
