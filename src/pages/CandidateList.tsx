import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import CandidateListPanel from '../components/candidates/CandidateListPanel';
import CandidatePreviewPanel from '../components/candidates/CandidatePreviewPanel';
import { useUIStore } from '../stores/uiStore';
import { useCandidates } from '../hooks/useCandidates'; 

export default function CandidateList() {
  const { documents: candidates } = useCandidates();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const { showPreviewPanel } = useUIStore();

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  useEffect(() => {
    // Auto-select first candidate when candidates are loaded and none is selected
    if (candidates.length > 0 && !selectedCandidateId) {
      setSelectedCandidateId(candidates[0].id!);
    }
  }, [candidates, selectedCandidateId]);

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={showPreviewPanel ? 'w-1/3 min-w-[400px]' : 'w-full'}
      >
        <CandidateListPanel
          onSelectCandidate={setSelectedCandidateId}
          selectedCandidateId={selectedCandidateId}
        />
      </motion.div>

      {showPreviewPanel && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex-1"
        >
          {selectedCandidate ? (
            <CandidatePreviewPanel
              candidate={selectedCandidate}
              onClose={() => setSelectedCandidateId(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a candidate to view details
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}