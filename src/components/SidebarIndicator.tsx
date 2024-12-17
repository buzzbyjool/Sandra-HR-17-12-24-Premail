import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';
import { Tooltip } from './Tooltip';

export default function SidebarIndicator() {
  const { sidebarExpanded, setSidebarExpanded, isMobile } = useLayout();
  const [isHovered, setIsHovered] = React.useState(false);

  if (isMobile || sidebarExpanded) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ 
          opacity: isHovered ? 0.95 : 0.85,
          x: 0,
          scale: isHovered ? 1.1 : 1
        }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setSidebarExpanded(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40"
      >
        <Tooltip content="Open Menu">
          <motion.button
            className="flex items-center justify-center w-6 h-24 
              bg-gradient-to-r from-[#373F98] to-[#0BDFE7]
              hover:from-[#4B54B0] hover:to-[#20E5EC]
              rounded-r-lg transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-[#373F98]/30
              shadow-lg hover:shadow-xl
              group"
            animate={{
              boxShadow: isHovered 
                ? '0 4px 12px rgba(55, 63, 152, 0.3)' 
                : '0 2px 8px rgba(55, 63, 152, 0.2)'
            }}
            whileHover={{ x: 2 }}
            aria-label="Open Menu"
          >
            <motion.div
              animate={{
                x: [0, 3, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ChevronRight 
                size={24} 
                className="text-white/90 group-hover:text-white 
                  drop-shadow-md transition-all duration-300"
              />
            </motion.div>
          </motion.button>
        </Tooltip>
      </motion.div>
    </AnimatePresence>
  );
}