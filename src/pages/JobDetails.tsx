import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, Users, Pencil, GitPullRequest, X, Building2, Archive, ArrowLeft, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useJobs } from '../hooks/useJobs';
import { Dialog } from '@headlessui/react';
import JobForm from '../components/JobForm';
import JobNotes from '../components/JobNotes';
import JobCandidateList from '../components/JobCandidateList'; 
import JobClosingDialog from '../components/JobClosingDialog';
import ArchivedBadge from '../components/ArchivedBadge';
import { useArchive } from '../hooks/useArchive';
import { toast } from 'react-hot-toast';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { documents: jobs, update, remove } = useJobs();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showClosingDialog, setShowClosingDialog] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const { archiveJob } = useArchive();
  const noteInputRef = useRef<HTMLTextAreaElement>(null);
  const notesContainerRef = useRef<HTMLDivElement>(null);

  const [editForm, setEditForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    company: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const job = jobs.find(j => j.id === id);

  // Update form when job data changes
  useEffect(() => {
    if (job) {
      setEditForm({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        description: job.description,
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
        company: job.company,
        contactFirstName: job.contactFirstName || '',
        contactLastName: job.contactLastName || '',
        contactEmail: job.contactEmail || '',
        contactPhone: job.contactPhone || ''
      });
    }
  }, [job?.id]); // Only update when job ID changes

  if (!job) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job.id) return;

    try {
      setLoading(true);
      await update(job.id, {
        ...editForm,
        requirements: editForm.requirements.split('\n').filter(Boolean),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!job.id) return;

    try {
      setLoading(true);
      await remove(job.id);
      navigate('/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Navigate back to pipeline if coming from pipeline, otherwise to jobs
    const fromPipeline = location.pathname.includes('pipeline');
    navigate(fromPipeline ? '/pipeline' : '/jobs');
  };

  const handleShowNotes = () => {
    setShowNotes(true);
    // Wait for animation to complete before scrolling and focusing
    if (notesContainerRef.current) {
      setTimeout(() => {
        notesContainerRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
        noteInputRef.current?.focus();
      }, 300);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 overflow-hidden"
      >
        <div className="border-b border-gray-200/50">
          <div className="px-6 py-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-700 
                bg-gray-50/80 hover:bg-gray-100/80 rounded-lg transition-colors w-fit mb-4"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="mt-2 flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-1">
                  <Building2 size={18} />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={18} />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={18} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={18} />
                  <span>0 candidates</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {job.status === 'archived' ? (
                <ArchivedBadge reason={job.archiveMetadata?.reason || 'other'} />
              ) : (
                <button
                  onClick={() => setShowClosingDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Archive size={18} />
                  Archive
                </button>
              )}
              <button
                onClick={handleShowNotes}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showNotes 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageSquare size={18} />
                {showNotes ? 'Hide Notes' : 'Show Notes'}
              </button>
              <motion.button
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-4 py-2 flex items-center gap-2
                  bg-white/80 backdrop-blur-sm border border-gray-200/50
                  rounded-lg shadow-sm hover:shadow-md
                  text-gray-700 hover:text-gray-900
                  transition-all duration-200"
              >
                <Pencil size={18} className="transition-transform group-hover:rotate-12" />
                <span className="relative z-10">{t('common.edit')}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/pipeline')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-4 py-2 flex items-center gap-2
                  bg-gradient-to-r from-[#373F98]/90 via-[#2A9BC1]/90 to-[#0BDFE7]/90
                  text-white rounded-lg font-medium 
                  shadow-[0_4px_20px_-1px_rgba(55,63,152,0.3)]
                  hover:shadow-[0_8px_25px_-1px_rgba(55,63,152,0.4)]
                  transition-all duration-300 ease-out
                  overflow-hidden
                  border border-white/10"
                style={{
                  backgroundSize: '200% 100%',
                  backgroundPosition: 'left center',
                }}
              >
                <GitPullRequest size={18} className="transition-transform group-hover:rotate-12" />
                <span className="relative z-10">{t('jobs.view_pipeline')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">{t('jobs.details')}</h2>
            <p className="text-gray-600">{job.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">{t('jobs.requirements')}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Candidates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        ref={notesContainerRef}
        className="bg-white rounded-lg shadow-sm overflow-hidden flex relative min-h-[400px]"
      >
        <div className="flex-1 p-6">
          <JobCandidateList jobId={job.id!} />
        </div>

        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-gray-200 overflow-hidden flex-shrink-0"
            >
              <JobNotes jobId={job.id!} inputRef={noteInputRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold">
                {t('jobs.edit')}
              </Dialog.Title>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <JobForm
                formData={editForm}
                onChange={(data) => setEditForm(data)}
                disabled={loading}
              />

              <div className="flex justify-between gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  {t('common.delete')}
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? t('common.saving') : t('common.save')}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </Dialog>

      <Dialog
        open={isDeleting}
        onClose={() => setIsDeleting(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              {t('jobs.delete_confirm')}
            </Dialog.Title>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? t('common.deleting') : t('common.delete')}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      <JobClosingDialog
        isOpen={showClosingDialog}
        onClose={() => setShowClosingDialog(false)}
        jobId={job.id!}
      />
    </div>
  );
}