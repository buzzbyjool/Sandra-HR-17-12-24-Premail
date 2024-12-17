import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, FileText, Trash2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useFirestore } from '../../hooks/useFirestore';
import { where } from 'firebase/firestore';
import { useDataContext } from '../../hooks/useDataContext';
import { Candidate } from '../../types/candidate';
import { formatDistanceToNow } from 'date-fns';
import { useArchive } from '../../hooks/useArchive';
import { toast } from 'react-hot-toast';
import ArchivedBadge from '../ArchivedBadge';
import ArchiveDetailsModal from './ArchiveDetailsModal';

interface ArchivedCandidateListProps {
  itemsPerPage: number;
  viewMode: 'list' | 'grid';
  searchFilters: any;
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export default function ArchivedCandidateList({ itemsPerPage, viewMode }: ArchivedCandidateListProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();
  const { documents: archivedCandidates, remove } = useFirestore<Candidate>({
    collectionName: 'candidates',
    queries: [
      where('companyId', '==', companyId || ''),
      where('status', '==', 'archived')
    ],
    enforceContext: true
  });
  const { restoreCandidate, permanentlyDelete } = useArchive();
  const [currentPage, setCurrentPage] = useState(1);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);

  const handleRestore = async (candidate: Candidate) => {
    if (!candidate.id) return;
    
    try {
      setLoading(true);
      const result = await restoreCandidate(candidate.id);
      if (result?.success) {
        toast.success('Candidate restored successfully');
      }
    } catch (error) {
      console.error('Error restoring candidate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to restore candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!candidateToDelete) return;
    
    try {
      setLoading(true);
      await permanentlyDelete(candidateToDelete, 'candidate');
      toast.success('Candidate permanently deleted');
      setCandidateToDelete(null);
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    } finally {
      setLoading(false);
    }
  };

  const paginatedCandidates = archivedCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {paginatedCandidates.map(candidate => (
        <motion.div
          key={candidate.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                {candidate.name} {candidate.surname}
              </h3>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Archived {formatDistanceToNow(new Date(candidate.archiveMetadata?.archivedAt || ''))} ago</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ArchivedBadge 
                reason={candidate.archiveMetadata?.reason || 'other'}
                onStatusChange={() => handleRestore(candidate)}
                canToggle={true}
                loading={loading}
              />
              <button
                onClick={() => setCandidateToDelete(candidate.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                title="Permanently delete candidate"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setSelectedCandidate(candidate)}
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
        open={!!candidateToDelete}
        onClose={() => setCandidateToDelete(null)}
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
              Delete Candidate Permanently
            </Dialog.Title>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this candidate? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCandidateToDelete(null)}
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

      {selectedCandidate && (
        <ArchiveDetailsModal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          item={selectedCandidate}
          type="candidate"
        />
      )}
    </div>
  );
}