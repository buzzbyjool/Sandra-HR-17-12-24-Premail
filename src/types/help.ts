export interface HelpContent {
  id: string;
  title: string;
  content: string;
  path: string;
  category: string;
  keywords: string[];
  relatedTopics?: string[];
  lastUpdated: string;
  translations: {
    en: {
      title: string;
      content: string;
    };
    fr: {
      title: string;
      content: string;
    };
  };
}

export interface HelpSection {
  id: string;
  title: string;
  icon?: string;
  content: string;
  subsections?: HelpSection[];
}

export interface HelpContextState {
  isOpen: boolean;
  activeSection: string | null;
  searchQuery: string;
  language: 'en' | 'fr';
}