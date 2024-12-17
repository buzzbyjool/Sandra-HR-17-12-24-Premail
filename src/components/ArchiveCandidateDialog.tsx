import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Archive, X } from 'lucide-react';
import { useArchive } from '../hooks/useArchive';
import { ArchiveReason } from '../types/archive';
import { toast } from 'react-hot-toast';

interface ArchiveCandidateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
}

const archiveReasons: { value: ArchiveReason; label: string }[] = [
  { value: 'withdrawn', label: 'No longer interested in the position' },
  { value: 'position_filled', label: 'Position already filled' },
  { value: 'rejected', label: 'Unqualified for the role' },
  { value: 'rejected', label: 'Failed background check' },
  { value: 'withdrawn', label: 'Unable to reach/No response' },
  { value: 'withdrawn', label: 'Declined offer' },
  { value: 'withdrawn', label: 'Accepted another opportunity' },
  { value: 'withdrawn', label: 'Salary expectations mismatch' },
  { value: 'withdrawn', label: 'Location/relocation issues' },
  { value: 'other', label: 'Other' }
];

export default function ArchiveCandidateDialog({ 
  isOpen, 
  onClose, 
  candidateId,
  candidateName 
}: ArchiveCandidateDialogProps) {
  const [reason, setReason] = useState<ArchiveReason>('withdrawn');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { archiveCandidate } = useArchive();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      toast.error('Please provide additional notes');
      return;
    }

    try {
      setLoading(true);
      await archiveCandidate(candidateId, reason, notes);
      toast.success('Candidate archived successfully');
      onClose();
    } catch (error) {
      console.error('Error archiving candidate:', error);
      toast.error('Failed to archive candidate');
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
          className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Archive className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Archive Candidate
              </Dialog.Title>
              <p className="text-sm text-gray-500">
                {candidateName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Archiving
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ArchiveReason)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                {archiveReasons.map((r) => (
                  <option key={r.label} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Please provide details about the archival reason..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Archiving...' : 'Archive Candidate'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
}