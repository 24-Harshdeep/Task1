import { motion } from 'framer-motion';
import React from 'react';

const DashboardCard = ({ title, children, action }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-textPrimary">{title}</h2>
        {action && action}
      </div>
      {children}
    </motion.div>
  );
};

export default React.memo(DashboardCard);
