import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, MapPin, Building, Trash2, Briefcase, Archive, Bot } from 'lucide-react';
import { Candidate } from '../../types/candidate';
import { getExperienceLevel, experienceLevelColors } from '../../utils/experienceLevel';
import ArchiveCandidateDialog from '../ArchiveCandidateDialog';
import { Tooltip } from '../Tooltip';
import { Dialog } from '@headlessui/react';
import { useJobs } from '../../hooks/useJobs';
import { useCandidateJobs } from '../../hooks/useCandidateJobs';
import { toast } from 'react-hot-toast';
import { formatCreationDate } from '../../utils/dateFormatters';

interface CandidateListItemProps {
  candidate: Candidate;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export default function CandidateListItem({ 
  candidate, 
  isSelected, 
  onClick, 
  onDelete 
}: CandidateListItemProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { documents: jobs } = useJobs();
  const { add: addCandidateJob } = useCandidateJobs(candidate.id);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete || !candidate.id) return;
    setShowDeleteDialog(true);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowArchiveDialog(true);
  };

  const handleJobClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowJobDialog(true);
  };

  const handleAssignJob = async (jobId: string) => {
    try {
      await addCandidateJob({
        candidateId: candidate.id!,
        jobId,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setShowJobDialog(false);
      toast.success('Candidate assigned to job successfully');
    } catch (error) {
      console.error('Error assigning job:', error);
      toast.error('Failed to assign job to candidate');
    }
  };

  const confirmDelete = () => {
    if (onDelete && candidate.id) {
      onDelete(candidate.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div>
      <motion.div
        whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        className={`py-2 px-3 cursor-pointer transition-colors border-b border-gray-100/60 hover:bg-gray-50/90 ${
          isSelected 
            ? 'bg-indigo-50/90 border-l-2 border-indigo-500' 
            : 'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none border-l-2 border-l-transparent'
        }`}
        tabIndex={0}
        role="button"
        aria-selected={isSelected}
      >
        <div className="flex items-center justify-between min-h-[2.5rem]">
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 bg-gradient-to-br from-[#0BDFE7] to-[#373F98] rounded-full 
                flex items-center justify-center text-white text-sm font-medium"
              aria-hidden="true"
            >
              {candidate.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900 leading-none">
                  {candidate.name} {candidate.surname}
                </h3>
                <span className="text-xs text-gray-500">
                  {formatCreationDate(candidate.createdAt)}
                </span>
                {candidate.source === 'AI Sandra HR' && (
                  <Tooltip content="AI-assisted sourcing">
                    <Bot size={16} className="text-gray-500 flex-shrink-0" />
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  <p className="text-xs text-gray-500">{candidate.position}</p>
                {candidate.yearsOfExperience !== undefined && (
                  <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full border ${
                    experienceLevelColors[getExperienceLevel(candidate.yearsOfExperience)].bg
                  } ${experienceLevelColors[getExperienceLevel(candidate.yearsOfExperience)].text}
                   ${experienceLevelColors[getExperienceLevel(candidate.yearsOfExperience)].border}`}>
                    {getExperienceLevel(candidate.yearsOfExperience)}
                  </span>
                )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="flex items-center gap-1 text-yellow-500 mr-2" aria-label={`Rating: ${candidate.rating} out of 10`}>
              <Star size={14} fill="currentColor" />
              <span className="text-[11px] font-medium">{candidate.rating}</span>
            </div>
            <button
              onClick={handleJobClick}
              className="p-1 text-gray-400 hover:text-indigo-500 rounded hover:bg-indigo-50 transition-colors"
              aria-label="Assign to job"
            >
              <Briefcase size={16} />
            </button>
            <button
              onClick={handleArchive}
              className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
              aria-label="Archive candidate"
            >
              <Archive size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
              aria-label="Delete candidate"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        className="fixed z-[60] inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              {t('common.delete')}
            </Dialog.Title>
            
            <p className="text-gray-600 mb-6">
              {t('candidate.delete_confirm', { name: `${candidate.name} ${candidate.surname}` })}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                {t('common.delete')}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      {/* Archive Dialog */}
      <ArchiveCandidateDialog
        isOpen={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        candidateId={candidate.id!}
        candidateName={`${candidate.name} ${candidate.surname}`}
      />
    </div>
  );
}