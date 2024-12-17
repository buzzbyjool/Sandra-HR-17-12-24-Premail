import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, Trash2, Info, CheckCircle, Building2, MapPin, ChevronDown, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import AddCandidateToJobModal from './AddCandidateToJobModal';
import { useJobs } from '../hooks/useJobs';
import { useCandidateJobs } from '../hooks/useCandidateJobs';
import { useCandidates } from '../hooks/useCandidates';
import { Dialog } from '@headlessui/react';
import { useArchive } from '../hooks/useArchive';
import { toast } from 'react-hot-toast';
import JobClosingDialog from './JobClosingDialog';
import { Tooltip } from '../components/Tooltip';

interface JobMenuProps {
  onSelectJob: (jobId: string | null) => void;
  selectedJobId: string | null;
  className?: string;
}

export default function JobMenu({ onSelectJob, selectedJobId, className = '' }: JobMenuProps) {
  const { documents: jobs, remove } = useJobs('Active'); // Only get active jobs
  const { documents: candidateJobs } = useCandidateJobs(); 
  const { documents: candidates } = useCandidates();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { archiveJob } = useArchive();
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [jobToArchive, setJobToArchive] = useState<string | null>(null);
  const [archiveReason, setArchiveReason] = useState<'filled' | 'closed'>('filled');
  const [jobToClose, setJobToClose] = useState<string | null>(null);
  const [addCandidateJobId, setAddCandidateJobId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const jobsPerRow = 4; // Number of jobs to show in one row
  const activeCandidatesCount = candidates.filter(candidate => 
    candidate.status === 'active' && 
    candidateJobs.some(cj => cj.candidateId === candidate.id)
  ).length;
  const totalJobs = jobs.length;
  const hiddenJobs = totalJobs - jobsPerRow;

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();

      // Check on resize
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [jobs.length]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollTo({
        left: container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  // Get candidate count for each job
  const getJobCandidateCount = (jobId: string) => {
    return candidateJobs.filter(cj => 
      cj.jobId === jobId && 
      cj.status !== 'rejected' && 
      cj.status !== 'inactive'
    ).length;
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      setLoading(true);
      await remove(jobToDelete);
      toast.success('Job deleted successfully');
      setJobToDelete(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!jobToArchive) return;
    try {
      setLoading(true);
      await archiveJob(
        jobToArchive,
        archiveReason === 'filled' ? 'position_filled' : 'position_cancelled',
        archiveReason === 'filled' ? 'Position has been filled' : 'Position is no longer available'
      );
      toast.success('Job archived successfully');
      onSelectJob(null);
      setJobToArchive(null);
    } catch (error) {
      console.error('Error archiving job:', error);
      toast.error('Failed to archive job');
    } finally {
      setLoading(false);
    }
  };

  const ActionButton = ({ icon: Icon, label, onClick, color, style }: any) => (
    <Tooltip content={label}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`p-1.5 rounded-lg transition-all duration-200 ${color}`}
        style={style}
      >
        <Icon size={18} style={style} />
      </button>
    </Tooltip>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
            <Tooltip content={`${jobs.length} active positions`}>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                <Building2 size={16} className="text-indigo-500" />
                {jobs.length}
              </div>
            </Tooltip>
            <span className="text-gray-300">|</span>
            <Tooltip content={`${activeCandidatesCount} active candidates with job assignments`}>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                <Users size={16} className="text-indigo-500" />
                {activeCandidatesCount}
              </div>
            </Tooltip>
          </div>
          {totalJobs > jobsPerRow && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 
                rounded-lg hover:bg-indigo-100 transition-colors group"
            >
              <ChevronDown
                size={16}
                className={`transform transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                } group-hover:translate-y-0.5`}
              />
              {isExpanded ? 'Show less' : `Show ${hiddenJobs} more job${hiddenJobs !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
        <div className="ml-auto">
          {/* Right side content if needed */}
        </div>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-lg
              hover:bg-white transition-all duration-200 border border-gray-200/50
              hover:scale-105 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}

        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-lg
              hover:bg-white transition-all duration-200 border border-gray-200/50
              hover:scale-105 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto flex gap-6 pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {jobs.slice(0, isExpanded ? undefined : jobsPerRow).map((job) => (
            <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' }
            }}
            onClick={() => onSelectJob(selectedJobId === job.id ? null : job.id)}
            className={`p-4 bg-white rounded-lg cursor-pointer transition-all group flex flex-col min-w-[300px] ${
              selectedJobId === job.id
                ? 'ring-2 ring-indigo-600 shadow-lg bg-white z-10'
                : 'hover:shadow-md hover:shadow-indigo-200/50 bg-white/95'
            } ${
              selectedJobId && selectedJobId !== job.id
                ? 'opacity-60 blur-[8px] scale-[0.98] saturate-50 [&>*]:!opacity-100'
                : 'opacity-100'
            } transition-all duration-400 ease-out`}
            tabIndex={0}
            role="button"
            aria-selected={selectedJobId === job.id}
            aria-label={`Select ${job.title} job`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectJob(selectedJobId === job.id ? null : job.id);
              }
            }}
            style={{
              backgroundColor: selectedJobId === job.id ? '#F5F7FF' : job.theme?.bgColor,
              borderColor: job.theme?.borderColor,
              '--job-color': job.theme?.color
            } as React.CSSProperties}
          >
            <div>
              <h3 className="font-semibold !opacity-100 line-clamp-2 min-h-[2.5rem] mb-2 transition-colors"
                style={{ color: 'var(--job-color)' }}>
                {job.title}
              </h3>
              <div className="mt-1 flex items-center gap-4 text-sm !opacity-100" 
                style={{ color: 'var(--job-color)' }}>
                <div className="flex items-center gap-1">
                  <Building2 size={16} style={{ color: 'var(--job-color)' }} />
                  <span className="truncate max-w-[120px]">{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} style={{ color: 'var(--job-color)' }} />
                  <span className="truncate max-w-[120px]">{job.location}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium !opacity-100" style={{ color: 'var(--job-color)' }}>
                  {getJobCandidateCount(job.id!)} active candidates
                </span>
              </div>
              <div className="flex items-center gap-4 !opacity-100">
                <ActionButton
                  icon={Plus}
                  label={t('jobs.add_candidate')}
                  onClick={() => setAddCandidateJobId(job.id)}
                  color="hover:bg-black/5"
                  style={{ color: 'var(--job-color)', opacity: 1 }}
                />
                <ActionButton
                  icon={Info}
                  label={t('jobs.view_details')}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  color="hover:bg-black/5"
                  style={{ color: 'var(--job-color)', opacity: 1 }}
                />
                <ActionButton
                  icon={CheckCircle}
                  label={t('jobs.mark_status')}
                  onClick={() => setJobToClose(job.id)}
                  color="hover:bg-black/5"
                  style={{ color: 'var(--job-color)', opacity: 1 }}
                />
                <ActionButton
                  icon={Trash2}
                  label={t('jobs.delete')}
                  onClick={() => setJobToDelete(job.id)}
                  color="hover:bg-black/5"
                  style={{ color: 'var(--job-color)', opacity: 1 }}
                />
              </div>
            </div>
          </motion.div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">Delete Job</Dialog.Title>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={!!jobToArchive}
        onClose={() => setJobToArchive(null)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">Archive Job</Dialog.Title>
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">Select a reason for archiving this job:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={archiveReason === 'filled'}
                    onChange={() => setArchiveReason('filled')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Position filled</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={archiveReason === 'closed'}
                    onChange={() => setArchiveReason('closed')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Position closed/cancelled</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setJobToArchive(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                {loading ? 'Archiving...' : 'Archive'}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      {/* Add Candidate Modal */}
      <AddCandidateToJobModal
        isOpen={!!addCandidateJobId}
        onClose={() => setAddCandidateJobId(null)}
        jobId={addCandidateJobId}
      />

      {/* Job Closing Dialog */}
      <JobClosingDialog
        isOpen={!!jobToClose}
        onClose={() => setJobToClose(null)}
        jobId={jobToClose!}
      />
    </div>
  );
}