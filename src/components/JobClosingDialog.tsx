import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Star, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCandidates } from '../hooks/useCandidates';
import { useCandidateJobs } from '../hooks/useCandidateJobs';
import { useArchive } from '../hooks/useArchive';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface JobClosingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

export default function JobClosingDialog({ isOpen, onClose, jobId }: JobClosingDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { documents: candidates } = useCandidates();
  const { documents: candidateJobs, remove: removeCandidateJob } = useCandidateJobs();
  const { archiveJob, archiveCandidate } = useArchive();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCancelReasons, setShowCancelReasons] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);

  const cancelReasons = [
    { id: 'budget', label: 'Budget constraints' },
    { id: 'position_cancelled', label: 'Position no longer needed' },
    { id: 'client_withdrew', label: 'Client withdrew' },
    { id: 'other', label: 'Other' }
  ];

  // Get candidates for this job
  const jobCandidates = candidates.filter(candidate => 
    candidateJobs.some(cj => 
      cj.jobId === jobId && 
      cj.candidateId === candidate.id &&
      cj.status !== 'rejected' &&
      cj.status !== 'inactive'
    )
  );

  const handleClose = async () => {
    if (!selectedCandidateId) {
      toast.error('Please select a hired candidate');
      return;
    }

    try {
      setLoading(true);

      // Archive the job
      const jobResult = await archiveJob(jobId, 'position_filled', `Position filled by candidate ${selectedCandidateId}`);
      if (!jobResult.success) {
        throw new Error('Failed to archive job');
      }

      // Archive the hired candidate
      const candidateResult = await archiveCandidate(selectedCandidateId, 'hired', `Hired for job ${jobId}`);
      if (!candidateResult.success) {
        throw new Error('Failed to archive candidate');
      }

      // Remove job associations for other candidates
      const otherCandidateJobs = candidateJobs.filter(cj =>
        cj.jobId === jobId && 
        cj.candidateId !== selectedCandidateId
      );

      for (const cj of otherCandidateJobs) {
        try {
          await removeCandidateJob(cj.id!);
        } catch (error) {
          console.error('Error removing candidate job:', error);
        }
      }

      toast.success('Job closed successfully');
      navigate('/jobs');
      onClose();
    } catch (error) {
      console.error('Error closing job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to close job');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason) {
      toast.error('Please select a reason for cancellation');
      return;
    }

    try {
      setLoading(true);

      // Archive the job
      const jobResult = await archiveJob(jobId, 'position_cancelled', cancelReason);
      if (!jobResult.success) {
        throw new Error('Failed to archive job');
      }

      // Remove all candidate job associations
      const jobCandidateAssociations = candidateJobs.filter(cj => cj.jobId === jobId);
      for (const cj of jobCandidateAssociations) {
        try {
          await removeCandidateJob(cj.id!);
        } catch (error) {
          console.error('Error removing candidate job:', error);
        }
      }

      toast.success('Job cancelled successfully');
      navigate('/jobs');
      onClose();
    } catch (error) {
      console.error('Error cancelling job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {showCancelReasons ? (
                <AlertTriangle className="text-red-500" size={24} />
              ) : (
                <CheckCircle className="text-indigo-500" size={24} />
              )}
            <Dialog.Title className="text-lg font-semibold">
              {showCancelReasons ? 'Cancel Job Position' : 'Select Hired Candidate'}
            </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {showCancelReasons ? (
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">
                Please select a reason for cancelling this job position:
              </p>

              <div className="space-y-2">
                {cancelReasons.map((reason) => (
                  <motion.div
                    key={reason.id}
                    onClick={() => setCancelReason(reason.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      cancelReason === reason.id
                        ? 'bg-red-50 border-2 border-red-500 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{reason.label}</span>
                      {cancelReason === reason.id && (
                        <XCircle className="text-red-600" size={20} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
            <p className="text-gray-600">
              Select the candidate who was hired for this position. Other candidates will be removed from this job.
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {jobCandidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  onClick={() => setSelectedCandidateId(candidate.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedCandidateId === candidate.id
                      ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {candidate.name} {candidate.surname}
                      </h3>
                      <p className="text-sm text-gray-500">{candidate.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span className="text-sm text-gray-600">{candidate.rating}/10</span>
                      </div>
                    </div>
                    {selectedCandidateId === candidate.id && (
                      <CheckCircle className="text-indigo-600" size={20} />
                    )}
                  </div>
                </motion.div>
              ))}
              {jobCandidates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No candidates available for this position
                </div>
              )}
            </div>
          </div>
          )}

          <div className="flex justify-between gap-3">
            {!showCancelReasons && (
              <button
                onClick={() => setShowCancelReasons(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                Lost/Canceled
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={() => {
                  if (showCancelReasons) {
                    setShowCancelReasons(false);
                    setCancelReason(null);
                  } else {
                    onClose();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {showCancelReasons ? 'Back' : 'Cancel'}
              </button>
              <button
                onClick={showCancelReasons ? handleCancel : handleClose}
                disabled={showCancelReasons ? !cancelReason : !selectedCandidateId || loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${
                  showCancelReasons 
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading 
                  ? (showCancelReasons ? 'Cancelling...' : 'Closing...') 
                  : (showCancelReasons ? 'Cancel Job' : 'Close Job')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}