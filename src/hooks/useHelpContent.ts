import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { helpContent } from '../data/help';
import type { HelpContent } from '../types/help';

export function useHelpContent() {
  const [content, setContent] = useState<HelpContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const currentPath = location.pathname.split('/')[1] || 'dashboard';
        
        // Get help content for current page
        const pageContent = helpContent[currentPath as keyof typeof helpContent];
        
        if (pageContent) {
          setContent(pageContent);
        } else {
          setContent(helpContent.dashboard); // Default to dashboard help if no specific content found
        }
      } catch (err) {
        console.error('Error loading help content:', err);
        setError('Failed to load help content');
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [location.pathname, i18n.language]);

  return { content, loading, error };
}