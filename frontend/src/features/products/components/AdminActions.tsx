import { Link } from "react-router-dom";

interface AdminActionsProps {
  slug: string;
  onDelete: () => void;
}

const AdminActions = ({ slug, onDelete }: AdminActionsProps) => {
  return (
    <div className="flex items-center gap-4 justify-end">
      <Link
        to={`/product/${slug}/update`}
        className="bg-gold-dark shadow-md active:scale-90 hover:opacity-95 text-xl teko text-center tracking-wider text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-all"
      >
        Update Product
      </Link>
      <button
        onClick={onDelete}
        className="bg-red-500 shadow-md active:scale-90 hover:opacity-95 text-xl teko text-center tracking-wider text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
      >
        Delete Product
      </button>
    </div>
  );
};

export default AdminActions;
