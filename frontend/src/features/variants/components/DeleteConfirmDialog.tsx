import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  show: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  show,
  loading,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="bg-background rounded-radius-lg p-6 max-w-sm w-full shadow-large"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-danger/10 rounded-full">
                <Trash2 className="w-5 h-5 text-danger" />
              </div>
              <h3 className="teko text-2xl text-text tracking-wider">
                Delete Variant?
              </h3>
            </div>
            <p className="mate text-sm text-text-subtle mb-6 leading-relaxed">
              This action is permanent. The variant and all its images will be
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 bg-danger text-white teko text-xl tracking-wider py-2.5 rounded-radius-sm hover:bg-danger-dark active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
              <button
                onClick={onCancel}
                className="flex-1 border border-border/50 text-text-subtle teko text-xl tracking-wider py-2.5 rounded-radius-sm hover:bg-background-light transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmDialog;
