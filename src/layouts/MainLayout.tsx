import React from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '../contexts/LayoutContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SidebarIndicator from '../components/SidebarIndicator';
import SidebarTrigger from '../components/SidebarTrigger';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { sidebarExpanded, toggleSidebar, mainContentWidth } = useLayout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF7F8] via-[#F0F1F9] to-[#F5F6FA]">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <SidebarIndicator />
        <SidebarTrigger />
        <motion.main 
          className="flex-1 p-4 md:p-8"
          initial={false}
          animate={{ 
            marginLeft: sidebarExpanded ? '256px' : '0',
            width: mainContentWidth 
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        >
          <motion.div
            className="backdrop-blur-xl bg-white/95 p-4 md:p-8 rounded-2xl shadow-lg h-full"
            layout
            transition={{
              layout: { duration: 0.3 }
            }}
          >
            {children}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}