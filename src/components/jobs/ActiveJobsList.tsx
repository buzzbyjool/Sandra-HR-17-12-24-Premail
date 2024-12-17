import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, Plus, Info, CheckCircle, Trash2, Calendar } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { useCandidateJobs } from '../../hooks/useCandidateJobs';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import JobClosingDialog from '../JobClosingDialog';
import AddCandidateToJobModal from '../AddCandidateToJobModal';
import { Tooltip } from '../Tooltip';
import { format } from 'date-fns';

interface ActiveJobsListProps {
  sortField: 'title' | 'company' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  filters: {
    companies: string[];
    departments: string[];
    locations: string[];
    types: string[];
    experience: string | null;
    education: string | null;
  };
}
export default function ActiveJobsList({ sortField, sortDirection, filters }: ActiveJobsListProps) {
  const { documents: jobs, loading, error, remove } = useJobs('Active');
  const { documents: candidateJobs } = useCandidateJobs();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [jobToClose, setJobToClose] = useState<string | null>(null);
  const [addCandidateJobId, setAddCandidateJobId] = useState<string | null>(null);

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
      setIsDeleting(true);
      await remove(jobToDelete);
      toast.success('Job deleted successfully');
      setJobToDelete(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter jobs based on active filters
  const filteredJobs = useMemo(() => jobs.filter(job => {
    if (filters.companies.length > 0 && !filters.companies.includes(job.company)) {
      return false;
    }
    if (filters.departments.length > 0 && !filters.departments.includes(job.department)) {
      return false;
    }
    if (filters.locations.length > 0 && !filters.locations.includes(job.location)) {
      return false;
    }
    if (filters.types.length > 0 && !filters.types.includes(job.type)) {
      return false;
    }
    return true;
  }), [jobs, filters]);

  const ActionButton = ({ icon: Icon, label, onClick, color = 'hover:bg-gray-100' }: any) => (
    <Tooltip content={label}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`p-1.5 rounded-lg transition-colors ${color}`}
      >
        <Icon size={18} className="text-gray-500 hover:text-gray-700" />
      </button>
    </Tooltip>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No active jobs found
      </div>
    );
  }
  // Sort jobs based on current sort field and direction
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (sortField === 'title') {
      return direction * a.title.localeCompare(b.title);
    } else if (sortField === 'company') {
      return direction * a.company.localeCompare(b.company);
    } else {
      return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  });

  return (
    <div className="space-y-2">
      {sortedJobs.map((job) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border hover:shadow-sm transition-all group"
          style={{
            borderColor: job.theme?.borderColor,
            backgroundColor: job.theme?.bgColor,
          }}
        >
          <div 
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="p-4 cursor-pointer transition-colors relative overflow-hidden"
            style={{
              color: job.theme?.color
            }}
          >
            <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="font-medium" style={{ color: job.theme?.color }}>{job.title}</h3>
                  <Building2 size={16} style={{ color: job.theme?.color }} />
                  <span style={{ color: job.theme?.color }}>{job.company}</span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm" style={{ color: job.theme?.color }}>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} style={{ color: job.theme?.color }} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} style={{ color: job.theme?.color }} />
                    <span>{getJobCandidateCount(job.id!)} candidates</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} style={{ color: job.theme?.color }} />
                    <span>{format(new Date(job.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10" onClick={e => e.stopPropagation()}>
                <ActionButton
                  icon={Plus}
                  label="Add candidate"
                  onClick={() => setAddCandidateJobId(job.id)}
                  style={{ color: job.theme?.color }}
                />
                <ActionButton
                  icon={Info}
                  label="View details"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  style={{ color: job.theme?.color }}
                />
                <ActionButton
                  icon={CheckCircle}
                  label="Mark status"
                  onClick={() => setJobToClose(job.id)}
                  style={{ color: job.theme?.color }}
                />
                <ActionButton
                  icon={Trash2}
                  label="Delete job"
                  onClick={() => setJobToDelete(job.id)}
                  style={{ color: job.theme?.color }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}

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
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      {/* Job Closing Dialog */}
      <JobClosingDialog
        isOpen={!!jobToClose}
        onClose={() => setJobToClose(null)}
        jobId={jobToClose!}
      />

      {/* Add Candidate Modal */}
      <AddCandidateToJobModal
        isOpen={!!addCandidateJobId}
        onClose={() => setAddCandidateJobId(null)}
        jobId={addCandidateJobId}
      />
    </div>
  );
}