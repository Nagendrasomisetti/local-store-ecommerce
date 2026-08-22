import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toast } = useShop();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] shadow-lg rounded-xl overflow-hidden pointer-events-none"
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white shadow-rose-200'
                : 'bg-slate-800 text-white shadow-slate-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
