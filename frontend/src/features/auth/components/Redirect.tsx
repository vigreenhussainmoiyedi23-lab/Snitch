import { Link } from "react-router-dom";

const Redirect = ({ title = "", to = "", subtitle = "" }) => {
  return (
    <div>
      <p className="text-center text-sm text-text-muted flex gap-1 items-center justify-center">
        {subtitle}
        <Link to={to} className="font-semibold transition-colors text-gold">
          {title}
        </Link>
      </p>
    </div>
  );
};

export default Redirect;
