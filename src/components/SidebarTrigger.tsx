import React, { useEffect, useRef } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { useLocation } from 'react-router-dom';

export default function SidebarTrigger() {
  const { setSidebarExpanded, sidebarExpanded, isMobile } = useLayout();
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || isDashboard || sidebarExpanded) return;

      const triggerWidth = 20; // Width of trigger area in pixels
      
      if (e.clientX <= triggerWidth) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setSidebarExpanded(true);
      } else if (e.clientX > 256) { // Sidebar width
        // Add a small delay before hiding
        timeoutRef.current = setTimeout(() => {
          setSidebarExpanded(false);
        }, 300);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [setSidebarExpanded, isMobile, isDashboard, sidebarExpanded]);

  if (isMobile || isDashboard) return null;

  return (
    <div
      ref={triggerRef}
      className="fixed left-0 top-0 w-5 h-full z-20"
      style={{ pointerEvents: 'none' }}
    />
  );
}