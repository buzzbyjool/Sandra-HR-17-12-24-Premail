import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWindowSize } from '../hooks/useWindowSize';

interface LayoutContextType {
  sidebarExpanded: boolean;
  mainContentWidth: string;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  isMobile: boolean;
}

const LayoutContext = createContext<LayoutContextType>({
  sidebarExpanded: true,
  mainContentWidth: '100%',
  toggleSidebar: () => {},
  setSidebarExpanded: () => {},
  isMobile: false,
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isDashboard = location.pathname === '/';

  useEffect(() => {
    if (isDashboard && !isMobile) {
      setSidebarExpanded(true);
      return;
    }

    if (isMobile || !isDashboard) {
      setSidebarExpanded(false);
    }
  }, [location, isDashboard, isMobile]);

  const toggleSidebar = () => setSidebarExpanded(prev => !prev);

  // Calculate main content width based on sidebar state and screen size
  const mainContentWidth = isMobile 
    ? '100%' 
    : `calc(100% - ${sidebarExpanded ? '256px' : '0px'})`;

  return (
    <LayoutContext.Provider value={{ 
      sidebarExpanded, 
      setSidebarExpanded,
      toggleSidebar,
      mainContentWidth,
      isMobile
    }}>
      {children}
    </LayoutContext.Provider>
  );
};