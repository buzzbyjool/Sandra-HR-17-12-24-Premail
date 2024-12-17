import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpContextState } from '../types/help';

interface HelpContextValue extends HelpContextState {
  toggleHelp: () => void;
  setActiveSection: (section: string | null) => void;
  setSearchQuery: (query: string) => void;
}

const HelpContext = createContext<HelpContextValue | null>(null);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

export const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [state, setState] = useState<HelpContextState>({
    isOpen: false,
    activeSection: null,
    searchQuery: '',
    language: i18n.language as 'en' | 'fr'
  });

  const toggleHelp = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const setActiveSection = useCallback((section: string | null) => {
    setState(prev => ({ ...prev, activeSection: section }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // Update active section based on route changes
  React.useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    setActiveSection(path);
  }, [location, setActiveSection]);

  const value = {
    ...state,
    toggleHelp,
    setActiveSection,
    setSearchQuery
  };

  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
};