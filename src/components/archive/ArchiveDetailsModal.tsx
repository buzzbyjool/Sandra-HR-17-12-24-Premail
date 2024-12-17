import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Calendar, Building2, MapPin, Users, FileText, Mail, Phone, Star, Download } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Job } from '../../types/job';
import { Candidate } from '../../types/candidate';
import ArchivedBadge from '../ArchivedBadge';

interface ArchiveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Job | Candidate;
  type: 'job' | 'candidate';
}

export default function ArchiveDetailsModal({ isOpen, onClose, item, type }: ArchiveDetailsModalProps) {
  const isJob = type === 'job';
  const archiveDate = item.archiveMetadata?.archivedAt 
    ? formatDistanceToNow(new Date(item.archiveMetadata.archivedAt))
    : 'Unknown';

  const handleExport = () => {
    const data = JSON.stringify(item, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${item.id}-archive-details.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  {isJob ? <Building2 className="text-indigo-600" size={24} /> : 
                          <Users className="text-indigo-600" size={24} />}
                </div>
                <div>
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    {isJob ? (item as Job).title : `${(item as Candidate).name} ${(item as Candidate).surname}`}
                  </Dialog.Title>
                  <p className="text-gray-500">
                    {isJob ? (item as Job).department : (item as Candidate).position}
                  </p>
                </div>
              </div>
              <ArchivedBadge reason={item.archiveMetadata?.reason || 'other'} />
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {isJob ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-gray-400" />
                        <span className="text-gray-600">{(item as Job).company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-gray-400" />
                        <span className="text-gray-600">{(item as Job).location}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Mail size={18} className="text-gray-400" />
                        <span className="text-gray-600">{(item as Candidate).email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={18} className="text-gray-400" />
                        <span className="text-gray-600">{(item as Candidate).phone}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-gray-600">Created {format(new Date(item.createdAt), 'PPP')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-gray-600">Archived {archiveDate} ago</span>
                  </div>
                </div>
              </div>

              {/* Archive Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Archive Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Reason:</span> {item.archiveMetadata?.reason}
                  </p>
                  {item.archiveMetadata?.notes && (
                    <p className="text-gray-600">
                      <span className="font-medium">Notes:</span> {item.archiveMetadata.notes}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">Archived by:</span> {item.archiveMetadata?.archivedByName || 'Unknown User'}
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              {isJob ? (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Job Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-600">{(item as Job).description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Requirements</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {(item as Job).requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Candidate Details</h3>
                    <div className="space-y-4">
                      {(item as Candidate).skills.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {(item as Candidate).skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-400 fill-current" size={20} />
                        <span className="font-medium">{(item as Candidate).rating}/10</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Download size={16} />
                Export Details
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}