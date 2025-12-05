import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ q, a, defaultOpen = false }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-textPrimary">{q}</span>
        <span className="text-sm text-textSecondary">{open ? '−' : '+'}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="px-4 py-3 bg-white text-sm text-textSecondary"
          >
            <div>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = ({ items = [] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <FAQItem key={idx} q={it.q} a={it.a} defaultOpen={!!it.defaultOpen} />
      ))}
    </div>
  );
};

export default FAQ;
