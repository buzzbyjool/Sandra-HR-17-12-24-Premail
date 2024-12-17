import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import { useHelp } from '../../contexts/HelpContext';
import { useHelpContent } from '../../hooks/useHelpContent';
import { useTranslation } from 'react-i18next';

export default function HelpPanel() {
  const { isOpen, toggleHelp, searchQuery, setSearchQuery } = useHelp();
  const { i18n } = useTranslation();
  const { content, loading } = useHelpContent();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentLanguage = i18n.language as 'en' | 'fr';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={toggleHelp}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-1/4 min-w-[320px] max-w-md 
              bg-[#FAFAFA] shadow-[0_4px_8px_rgba(0,0,0,0.1)] z-50 flex flex-col
              rounded-l-xl border-l border-gray-200/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#373F98] to-[#0BDFE7] bg-clip-text text-transparent">
                {loading ? 'Loading...' : content?.translations[currentLanguage]?.title || 'Help Center'}
              </h2>
              <button
                onClick={toggleHelp}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg 
                  hover:bg-white/50 transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search help topics..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg 
                    focus:ring-2 focus:ring-[#373F98]/20 focus:border-[#373F98]/20 transition-all duration-300
                    placeholder-gray-400 text-gray-600"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#373F98]" />
                </div>
              ) : content && content.translations[currentLanguage] ? (
                <div className="p-6">
                  <div 
                    className="prose prose-sm max-w-none prose-headings:text-[#373F98] 
                      prose-a:text-[#0BDFE7] prose-strong:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: content.translations[currentLanguage].content }}
                  />
                  
                  {content.relatedTopics?.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200/50">
                      <h3 className="text-sm font-medium text-[#373F98] mb-2">Related Topics</h3>
                      <div className="space-y-2">
                        {content.relatedTopics.map((topic, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedTopic(topic)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#373F98]
                              w-full p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <ExternalLink size={16} />
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No help content available for this page
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}