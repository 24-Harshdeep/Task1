import { motion } from 'framer-motion';
import { navigationItems } from '../data/dummyData';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppState, useAppActions } from '../context/AppContext';

const Sidebar = ({ activeItem, setActiveItem, isMobile, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useAppState();
  const actions = useAppActions();

  // local responsive detection if page didn't pass isMobile
  const [localIsMobile, setLocalIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const check = () => setLocalIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const resolvedIsMobile = typeof isMobile === 'boolean' ? isMobile : localIsMobile;
  const resolvedIsOpen = typeof isOpen === 'boolean' ? isOpen : (state && state.sidebarOpen);
  const resolvedOnClose = typeof onClose === 'function' ? onClose : (actions && actions.closeSidebar ? actions.closeSidebar : () => {});

  if (resolvedIsMobile && !resolvedIsOpen) return null;

  // determine navbar height so the sidebar can sit below it responsively
  const [navHeight, setNavHeight] = useState(80);
  useEffect(() => {
    const update = () => {
      const nav = document.querySelector('nav');
      const h = nav ? Math.round(nav.getBoundingClientRect().height) : 80;
      setNavHeight(h);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Mobile: render a backdrop + sliding panel so clicking outside closes the panel
  if (resolvedIsMobile) {
    return (
      <div className="fixed inset-0 z-40 flex">
        {/* Keep the top area (navbar) clear so sidebar doesn't overlap it */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-x-0 bottom-0 bg-black/30"
          style={{ top: navHeight }}
          onClick={() => resolvedOnClose && resolvedOnClose()}
        />
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="relative bg-white shadow-lg w-64 p-6 overflow-auto"
          style={{ top: navHeight, height: `calc(100vh - ${navHeight}px)` }}
        >
          {/* Close button removed — clicking outside/backdrop closes the panel */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path || activeItem === item.name;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    setActiveItem(item.name);
                    try { navigate(item.path); } catch (e) { }
                    if (resolvedOnClose) resolvedOnClose();
                  }}
                  className={({ isActive: navIsActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left pointer-events-auto ${ (navIsActive || isActive) ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:bg-card' }`}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                </NavLink>
              );
            })}
          </nav>
        </motion.aside>
      </div>
    );
  }

  // Desktop / large: sticky sidebar
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 bottom-0 bg-white shadow-lg w-64 p-6 overflow-auto"
      style={{ top: navHeight }}
    >
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path || activeItem === item.name;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => {
                setActiveItem(item.name);
                try { navigate(item.path); } catch (e) { }
              }}
              className={({ isActive: navIsActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left pointer-events-auto ${ (navIsActive || isActive) ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:bg-card' }`}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
