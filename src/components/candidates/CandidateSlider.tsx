import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';
import CandidateListItem from './CandidateListItem';
import { Candidate } from '../../types/candidate';

interface CandidateSliderProps {
  candidates: Candidate[];
  onSelectCandidate: (id: string) => void;
  selectedCandidateId: string | null;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function CandidateSlider({
  candidates,
  onSelectCandidate,
  selectedCandidateId,
  onDelete,
  className = ''
}: CandidateSliderProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState(true);
  const [ref, inView] = useInView();

  // Create virtualizer instance
  const rowVirtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Estimated height of each candidate item
    overscan: 5 // Number of items to render outside of the visible area
  });

  // Check if scrolling is needed
  useEffect(() => {
    if (parentRef.current) {
      const { scrollHeight, clientHeight } = parentRef.current;
      setShowScrollButtons(scrollHeight > clientHeight);
    }
  }, [candidates.length]);

  const scrollTo = (direction: 'up' | 'down') => {
    if (!parentRef.current) return;

    const currentScroll = parentRef.current.scrollTop;
    const scrollAmount = 200; // Pixels to scroll
    const targetScroll = direction === 'up' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    parentRef.current.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
    setScrollPosition(targetScroll);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollTo('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollTo('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative h-full ${className}`}>
      <div
        ref={parentRef}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{
          contain: 'strict',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const candidate = candidates[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <CandidateListItem
                  candidate={candidate}
                  isSelected={selectedCandidateId === candidate.id}
                  onClick={() => onSelectCandidate(candidate.id!)}
                  onDelete={onDelete}
                />
              </div>
            );
          })}
        </div>
        <div ref={ref} className="h-px" /> {/* Intersection observer target */}
      </div>

      <AnimatePresence>
        {showScrollButtons && (
          <>
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              onClick={() => scrollTo('up')}
              className="absolute right-4 top-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 
                transition-all duration-200 border border-gray-200 text-gray-600 hover:text-gray-800
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Scroll up"
            >
              <ChevronUp size={20} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              onClick={() => scrollTo('down')}
              className="absolute right-4 bottom-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 
                transition-all duration-200 border border-gray-200 text-gray-600 hover:text-gray-800
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Scroll down"
            >
              <ChevronDown size={20} />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}