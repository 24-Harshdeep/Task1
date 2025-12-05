import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAppState, useAppActions } from '../context/AppContext';

const Navbar = ({ user: userProp, onLogout: onLogoutProp, onSearch, onToggleSidebar }) => {
  const [term, setTerm] = useState('');
  const state = useAppState();
  const actions = useAppActions();
  const user = userProp || (state && state.user ? state.user.fullName : null);
  const onLogout = onLogoutProp || (actions && actions.logout ? actions.logout : () => {});

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch && onSearch(term.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [term, onSearch]);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50"
    >
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-primary">Neximprove</h1>
        <div className="hidden md:block">
          <input 
            type="search" 
            placeholder="Search shipments..." 
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (typeof onToggleSidebar === 'function') return onToggleSidebar();
            if (actions && actions.toggleSidebar) return actions.toggleSidebar();
          }}
          className="md:hidden p-2 rounded-lg bg-white/30 mr-2"
        >
          ☰
        </button>
        <span className="text-textSecondary hidden sm:inline">
          Welcome, <span className="font-medium text-textPrimary">{user}</span>
        </span>
        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
          {user?.charAt(0).toUpperCase()}
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
