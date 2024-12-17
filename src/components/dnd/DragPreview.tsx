import React from 'react';
import { motion } from 'framer-motion';
import { DragOverlay } from '@dnd-kit/core';
import { Candidate } from '../../types/candidate';

interface DragPreviewProps {
  candidate: Candidate | null;
}

export default function DragPreview({ candidate }: DragPreviewProps) {
  if (!candidate) return null;

  return (
    <DragOverlay dropAnimation={null}>
      <motion.div
        initial={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        animate={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' }}
        className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-indigo-200/50 cursor-grabbing"
      >
        <div className="opacity-75">
          <h3 className="font-medium text-gray-900">
            {candidate.name} {candidate.surname}
          </h3>
          <p className="text-sm text-gray-500">{candidate.position}</p>
        </div>
      </motion.div>
    </DragOverlay>
  );
}