import { motion } from 'framer-motion';
import React from 'react';

const StatWidget = ({ stat, index }) => {
  const colorMap = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorMap[stat.color]} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {stat.icon}
        </div>
        {stat.trend ? (
          <span className="text-sm font-medium text-success">{stat.trend}</span>
        ) : null}
      </div>
      <h3 className="text-3xl font-bold text-textPrimary mb-1">{stat.value}</h3>
      <p className="text-textSecondary text-sm">{stat.title}</p>
    </motion.div>
  );
};

export default React.memo(StatWidget);
