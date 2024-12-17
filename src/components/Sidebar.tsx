import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GitPullRequest, Settings, Briefcase, Archive } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '../contexts/LayoutContext';

const navItems = [
  { icon: LayoutDashboard, label: 'sidebar.dashboard', path: '/' },
  { icon: GitPullRequest, label: 'sidebar.pipeline', path: '/pipeline' },
  { icon: Users, label: 'sidebar.candidates', path: '/candidates' },
  { icon: Briefcase, label: 'sidebar.jobs', path: '/jobs' },
  { icon: Archive, label: 'sidebar.archive', path: '/archive' },
  { icon: Settings, label: 'sidebar.settings', path: '/settings' }
];

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const { sidebarExpanded, setSidebarExpanded, isMobile } = useLayout();
  const isDashboard = location.pathname === '/';

  useEffect(() => {
    if (isDashboard && !isMobile) {
      setShouldShow(true);
      setSidebarExpanded(true);
      return;
    }
    
    if (!isDashboard && !isHovered && !sidebarExpanded) {
      setShouldShow(false);
    }
  }, [location, isDashboard, isHovered, isMobile, setSidebarExpanded, sidebarExpanded]);

  const handleMouseLeave = () => {
    if (!isMobile && !isDashboard) {
      setIsHovered(false);
      // Don't immediately hide - let the trigger area handle this
    }
  };

  return (
    <AnimatePresence>
      {(shouldShow || sidebarExpanded) && (
        <motion.div
          initial={{ x: -256, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -256, opacity: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg pt-16 z-30
            ${isMobile ? 'shadow-xl' : 'shadow-lg'}`}
        >
          <nav className="px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => !isDashboard && setShouldShow(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0BDFE7] to-[#373F98] text-white shadow-md'
                      : 'text-gray-600 hover:bg-[#0BDFE7]/10'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{t(item.label)}</span>
              </NavLink>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}