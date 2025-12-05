import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const bgColor = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-red-500' : 'bg-primary';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-6 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl"
          style={{ backgroundColor: bgColor === 'bg-success' ? '#22C55E' : bgColor === 'bg-red-500' ? '#EF4444' : '#00AEEF' }}
        >
          <span className="text-white text-2xl font-bold">{icon}</span>
          <p className="text-white font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 text-xl font-bold"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
