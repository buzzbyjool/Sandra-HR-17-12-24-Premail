import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Candidate } from '../../types/candidate';
import CandidatePreview from './CandidatePreview';

interface CandidatePreviewPanelProps {
  candidate: Candidate;
  onClose: () => void;
}

export default function CandidatePreviewPanel({ candidate, onClose }: CandidatePreviewPanelProps) {
  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]/95 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[#373F98]/90 via-[#2A9BC1]/90 to-[#0BDFE7]/90 opacity-90" />
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{candidate.name} {candidate.surname}</h2>
            <p className="text-sm text-white/80 mt-1">{candidate.position}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white/90">
        <CandidatePreview
          candidate={candidate}
          onClose={onClose}
        />
      </div>
    </div>
  );
}