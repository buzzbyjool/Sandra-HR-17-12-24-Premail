import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Calendar, Users, FileText, Trash2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useFirestore } from '../../hooks/useFirestore';
import { where } from 'firebase/firestore';
import { useDataContext } from '../../hooks/useDataContext';
import { Job } from '../../types/job';
import { formatDistanceToNow } from 'date-fns';
import { useArchive } from '../../hooks/useArchive';
import { toast } from 'react-hot-toast';
import ArchivedBadge from '../ArchivedBadge';
import ArchiveDetailsModal from './ArchiveDetailsModal';

interface ArchivedJobListProps {
  itemsPerPage: number;
  viewMode: 'list' | 'grid';
  searchFilters: any;
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export default function ArchivedJobList({ itemsPerPage, viewMode }: ArchivedJobListProps) {
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();
  const { documents: archivedJobs, remove } = useFirestore<Job>({
    collectionName: 'jobs',
    queries: [
      where('companyId', '==', companyId || ''),
      where('status', '==', 'archived')
    ],
    enforceContext: true
  });
  const { updateArchiveStatus, permanentlyDelete } = useArchive();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const handleRestore = async (job: Job) => {
    if (!job.id) return;
    
    try {
      setLoading(true);
      await updateArchiveStatus(job.id, 'job', 'active');
      toast.success('Job restored successfully');
    } catch (error) {
      console.error('Error restoring job:', error);
      toast.error('Failed to restore job');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      setLoading(true);
      await permanentlyDelete(jobToDelete, 'job');
      toast.success('Job permanently deleted');
      setJobToDelete(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  const paginatedJobs = archivedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {paginatedJobs.map(job => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{job.title}</h3>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Building2 size={16} />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Archived {formatDistanceToNow(new Date(job.archiveMetadata?.archivedAt || ''))} ago</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ArchivedBadge 
                reason={job.archiveMetadata?.reason || 'other'}
                onStatusChange={() => handleRestore(job)}
                canToggle={true}
                loading={loading}
              />
              <button
                onClick={() => setJobToDelete(job.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                title="Permanently delete job"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setSelectedJob(job)}
                className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                <FileText size={20} />
              </button>
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
            <Dialog.Title className="text-lg font-semibold mb-4">
              Delete Job Permanently
            </Dialog.Title>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this job? This action cannot be undone.
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
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      {selectedJob && (
        <ArchiveDetailsModal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          item={selectedJob}
          type="job"
        />
      )}
    </div>
  );
}