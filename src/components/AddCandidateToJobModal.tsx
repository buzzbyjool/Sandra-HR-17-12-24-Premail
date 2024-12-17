import React, { useState, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Search, X, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useCandidateJobs } from '../hooks/useCandidateJobs';
import { toast } from 'react-hot-toast';

interface AddCandidateToJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

export default function AddCandidateToJobModal({ isOpen, onClose, jobId }: AddCandidateToJobModalProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { documents: jobs } = useJobs('Active'); // Only get active jobs
  const { documents: candidateJobs, add: addCandidateJob } = useCandidateJobs();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CandidateJob['status']>('in_progress');

  const { documents: candidates } = useCandidates();

  // Filter active candidates only and exclude those already assigned to this job
  const availableCandidates = useMemo(() => {
    const assignedCandidateIds = new Set(
      candidateJobs
        .filter(cj => cj.jobId === jobId)
        .map(cj => cj.candidateId)
    );

    return candidates.filter(candidate => 
      candidate.status === 'active' &&
      !assignedCandidateIds.has(candidate.id!) &&
      (searchTerm === '' || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [candidates, candidateJobs, jobId, searchTerm]);

  const linkedJobIds = new Set(candidateJobs.map(cj => cj.jobId));
  const availableJobs = jobs.filter(job => 
    !linkedJobIds.has(job.id!) &&
    (searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCandidate = async (candidateId: string) => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      await addCandidateJob({
        candidateId,
        jobId,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast.success(t('jobs.candidate_added'));
    } catch (error) {
      console.error('Error adding candidate to job:', error);
      toast.error(t('jobs.candidate_add_error'));
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
          className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold">
              {t('jobs.add_candidate')}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, department, or company..."
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    bg-gray-50 hover:bg-white transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 
                      hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {availableCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddCandidate(candidate.id!)}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg 
                      hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            ))}
            {availableCandidates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No available candidates found
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}